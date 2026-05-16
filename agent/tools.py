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

    prompt = f"""Analyse these historical linkage outcomes grouped by sector and mentor type.
Identify recurring patterns that signal risk or opportunity.

LINKAGES:
{json.dumps(linkages, indent=2)}

Return ONLY a valid JSON array (empty array [] if no significant patterns):
[{{"pattern_text": "description", "severity": "warning or alert"}}]"""

    try:
        response = _client.models.generate_content(
            model=_MODEL,
            contents=prompt,
            config=_GEN_CONFIG,
        )
        patterns = _parse_gemini_json(response.text)

        return [
            {
                "pattern_text": str(p.get("pattern_text", "")),
                "severity": p.get("severity") if p.get("severity") in ("warning", "alert") else "warning",
            }
            for p in (patterns if isinstance(patterns, list) else [])
        ]
    except Exception as exc:
        logger.error("detect_patterns failed: %s", exc)
        return []
