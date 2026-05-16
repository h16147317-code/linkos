import json
import logging
import os
import re

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

logger = logging.getLogger(__name__)

_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
_MODEL = "gemini-2.5-flash"
_GEN_CONFIG = types.GenerateContentConfig(
    temperature=0.2,
    response_mime_type="application/json",
)

_VALID_FLAGS = {
    "strong_traction", "burn_rate_concern", "team_gap", "strong_team",
    "market_validated", "early_stage_risk", "regional_strength",
    "b2b_traction", "team_size_concern", "sector_alignment",
}

_FALLBACK_SCORE = {"score": 50, "confidence": "low", "reasoning": "Evaluation failed.", "flags": []}


def _parse_gemini_json(text: str) -> dict | list:
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    return json.loads(text.strip())


def score_applicant(profile: dict, programme: dict, history_context: str) -> dict:
    prompt = f"""You are an expert grant programme evaluator for Cradle Fund Malaysia.
Evaluate this startup application against the programme criteria.

PROGRAMME: {programme.get("name", "")}
CRITERIA: {programme.get("criteria", "")}

APPLICANT PROFILE:
Company: {profile.get("company_name", "")}
Sector: {profile.get("sector", "")}
Stage: {profile.get("stage", "")}
Team size: {profile.get("team_size", "")}
Traction: {profile.get("traction", "")}
Pitch: {profile.get("pitch_summary", "")}

HISTORICAL LEARNING FROM PAST COHORTS:
{history_context}
Use this to calibrate your score relative to past accepted startups.

Return ONLY valid JSON:
{{
  "score": integer 0-100,
  "reasoning": "3 sentences: strengths, main concern, overall fit verdict",
  "flags": ["array", "chosen", "ONLY", "from", "the", "list", "below"]
}}

Valid flag values (use only these exact strings):
strong_traction, burn_rate_concern, team_gap, strong_team, market_validated,
early_stage_risk, regional_strength, b2b_traction, team_size_concern, sector_alignment"""

    try:
        response = _client.models.generate_content(
            model=_MODEL,
            contents=prompt,
            config=_GEN_CONFIG,
        )
        result = _parse_gemini_json(response.text)

        score = int(result.get("score", 50))
        confidence = "high" if (score > 75 or score < 40) else "medium"
        flags = [f for f in result.get("flags", []) if f in _VALID_FLAGS]

        return {
            "score": score,
            "confidence": confidence,
            "reasoning": result.get("reasoning", ""),
            "flags": flags,
        }
    except Exception as exc:
        logger.error("score_applicant failed for %s: %s", profile.get("company_name"), exc)
        return _FALLBACK_SCORE.copy()


def find_mentor_match(application: dict, mentors: list[dict]) -> list[dict]:
    available = [m for m in mentors if m.get("availability") != "full"]
    if not available:
        return []

    prompt = f"""You are a mentor matching expert for Cradle Fund Malaysia.

STARTUP:
Company: {application.get("company_name", "")}
Sector: {application.get("sector", "")}
Stage: {application.get("stage", "")}
Score: {application.get("score", "")}
Flags: {json.dumps(application.get("flags", []))}

AVAILABLE MENTORS:
{json.dumps(available, indent=2)}

Return ONLY a valid JSON array of top 3 matches, sorted by match_score descending.
Consider sector fit, expertise, availability, and success_rate.
[{{"mentor_id": "string", "match_score": 0-100, "reason": "max 15 words"}}]"""

    try:
        response = _client.models.generate_content(
            model=_MODEL,
            contents=prompt,
            config=_GEN_CONFIG,
        )
        matches = _parse_gemini_json(response.text)

        validated = [
            {
                "mentor_id": str(m.get("mentor_id", "")),
                "match_score": int(m.get("match_score", 0)),
                "reason": str(m.get("reason", "")),
            }
            for m in (matches if isinstance(matches, list) else [])[:3]
        ]
        return sorted(validated, key=lambda x: x["match_score"], reverse=True)
    except Exception as exc:
        logger.error("find_mentor_match failed for %s: %s", application.get("company_name"), exc)
        return []


def detect_patterns(linkages: list[dict]) -> list[dict]:
    if len(linkages) < 5:
        return []

    patterns: list[dict] = []

    # ── 1. Sector × mentor alignment analysis ────────────────────────────────
    sector_groups: dict[str, list[dict]] = {}
    for lnk in linkages:
        sector = lnk.get("sector", "unknown")
        sector_groups.setdefault(sector, []).append(lnk)

    for sector, group in sector_groups.items():
        cross = [
            lnk for lnk in group
            if sector not in (lnk.get("mentor_sector") or [])
        ]
        if not cross:
            continue
        dropout_count = sum(1 for lnk in cross if lnk.get("outcome") == "dropped_out")
        dropout_rate = dropout_count / len(cross) * 100
        if dropout_rate > 50:
            patterns.append({
                "severity": "alert",
                "pattern_text": (
                    f"{sector} startups with cross-sector mentors had "
                    f"{round(dropout_rate)}% dropout rate. "
                    f"Recommend sector-aligned matching for {sector} applicants."
                ),
            })

    # ── 2. Mentor overload ───────────────────────────────────────────────────
    mentor_counts: dict[str, int] = {}
    for lnk in linkages:
        mid = lnk.get("mentor_id", "")
        if mid:
            mentor_counts[mid] = mentor_counts.get(mid, 0) + 1

    for mentor_id, count in mentor_counts.items():
        if count > 4:
            patterns.append({
                "severity": "warning",
                "pattern_text": (
                    f"Mentor {mentor_id} has been assigned {count} times across cohorts. "
                    "Consider limiting new assignments to avoid mentor fatigue."
                ),
            })

    # ── 3. Overall graduation rate ───────────────────────────────────────────
    graduated = sum(1 for lnk in linkages if lnk.get("outcome") == "graduated")
    grad_rate = graduated / len(linkages) * 100

    if grad_rate < 40:
        patterns.append({
            "severity": "alert",
            "pattern_text": (
                f"Overall cohort graduation rate is {round(grad_rate)}%. "
                "Review programme criteria and mentor quality."
            ),
        })
    elif grad_rate > 70:
        patterns.append({
            "severity": "warning",
            "pattern_text": (
                f"Strong cohort performance at {round(grad_rate)}% graduation rate. "
                "Consider raising programme entry criteria for next cohort."
            ),
        })

    # ── 4. Regional bias ─────────────────────────────────────────────────────
    regional: dict[str, list[dict]] = {}
    for lnk in linkages:
        country = lnk.get("country", "")
        if country:
            regional.setdefault(country, []).append(lnk)

    if len(regional) >= 2:
        def _success_rate(group: list[dict]) -> float:
            successes = sum(
                1 for lnk in group
                if lnk.get("outcome") in ("graduated", "fundraised")
            )
            return successes / len(group) * 100

        overall_rate = _success_rate(linkages)
        for region, group in regional.items():
            rate = _success_rate(group)
            if overall_rate - rate >= 30:
                patterns.append({
                    "severity": "warning",
                    "pattern_text": (
                        f"Applicants from {region} have significantly lower success rates. "
                        "Possible regional bias — review evaluation criteria."
                    ),
                })

    # ── Sort: alerts first, then warnings ────────────────────────────────────
    patterns.sort(key=lambda p: 0 if p["severity"] == "alert" else 1)
    return patterns


# ── Quick test ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    test_linkages = [
        {"id": "l1", "founder_id": "f1", "mentor_id": "mnt_001",
         "sector": "healthtech", "mentor_sector": ["fintech"],
         "outcome": "dropped_out", "cohort": 11},
        {"id": "l2", "founder_id": "f2", "mentor_id": "mnt_001",
         "sector": "healthtech", "mentor_sector": ["fintech"],
         "outcome": "dropped_out", "cohort": 11},
        {"id": "l3", "founder_id": "f3", "mentor_id": "mnt_001",
         "sector": "healthtech", "mentor_sector": ["fintech"],
         "outcome": "dropped_out", "cohort": 11},
        {"id": "l4", "founder_id": "f4", "mentor_id": "mnt_002",
         "sector": "fintech", "mentor_sector": ["fintech"],
         "outcome": "graduated", "cohort": 11},
        {"id": "l5", "founder_id": "f5", "mentor_id": "mnt_002",
         "sector": "fintech", "mentor_sector": ["fintech"],
         "outcome": "graduated", "cohort": 11},
    ]

    result = detect_patterns(test_linkages)
    print(json.dumps(result, indent=2))
