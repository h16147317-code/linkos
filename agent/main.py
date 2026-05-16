import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from tools import detect_patterns, find_mentor_match, score_applicant

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("LinkOS AI Agent service started on port 8000")
    yield


app = FastAPI(title="LinkOS AI Agent", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response models ────────────────────────────────────────────────

class Programme(BaseModel):
    id: str
    name: str
    criteria: str
    cohort_number: int


class BatchRequest(BaseModel):
    applications: list[dict] = Field(default_factory=list)
    programme: Programme
    mentors: list[dict] = Field(default_factory=list)
    history_context: str = ""


class MentorSuggestion(BaseModel):
    mentor_id: str
    match_score: int
    reason: str


class ScoredApplication(BaseModel):
    id: str
    score: int
    confidence: str
    reasoning: str
    flags: list[str]
    mentor_suggestions: list[MentorSuggestion]


class BatchResponse(BaseModel):
    scored_applications: list[ScoredApplication]


# ── Endpoint ─────────────────────────────────────────────────────────────────

@app.post("/agent/process-batch", response_model=BatchResponse)
async def process_batch(request: BatchRequest) -> BatchResponse:
    if not request.applications:
        raise HTTPException(status_code=400, detail="No applications provided.")

    scored_applications: list[ScoredApplication] = []

    for application in request.applications:
        app_id = str(application.get("id", ""))
        company = application.get("company_name", app_id)

        try:
            # Step 1 — score the applicant
            eval_result = score_applicant(
                profile=application,
                programme=request.programme.model_dump(),
                history_context=request.history_context,
            )

            score: int = eval_result["score"]
            confidence: str = eval_result["confidence"]
            reasoning: str = eval_result["reasoning"]
            flags: list[str] = eval_result["flags"]

            # Step 2 — find mentor matches only for scores >= 60
            mentor_suggestions: list[dict] = []
            if score >= 60:
                enriched = {**application, "score": score, "flags": flags}
                mentor_suggestions = find_mentor_match(
                    application=enriched,
                    mentors=request.mentors,
                )

            scored_applications.append(
                ScoredApplication(
                    id=app_id,
                    score=score,
                    confidence=confidence,
                    reasoning=reasoning,
                    flags=flags,
                    mentor_suggestions=[MentorSuggestion(**m) for m in mentor_suggestions],
                )
            )
            logger.info("Processed %s — score=%d confidence=%s", company, score, confidence)

        except Exception as exc:
            logger.error("Failed to process application %s (%s): %s", app_id, company, exc)
            scored_applications.append(
                ScoredApplication(
                    id=app_id,
                    score=50,
                    confidence="low",
                    reasoning="Evaluation failed due to an internal error.",
                    flags=[],
                    mentor_suggestions=[],
                )
            )

    return BatchResponse(scored_applications=scored_applications)


@app.get("/health")
async def health():
    return {"status": "ok"}
