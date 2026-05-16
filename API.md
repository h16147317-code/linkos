# LinkOS API Contract
> Last updated: 16 May 2026 — update this file before changing any endpoint. Tell the team first.

---

## Base URLs (local development)

| Service       | Owner    | URL                    |
|---------------|----------|------------------------|
| Backend       | Person A | http://localhost:3000  |
| Agent         | Person B | http://localhost:8000  |
| Frontend      | Person C | http://localhost:5173  |

---

## 1. POST /api/founders
Save a new founder profile.

**Request body** `application/json`
```json
{
  "name": "string",
  "email": "string",
  "company_name": "string",
  "stage": "string",         // "idea" | "mvp" | "seed" | "series_a"
  "industry": "string",
  "pitch_summary": "string"
}
```

**Response 201**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "company_name": "string",
  "stage": "string",
  "industry": "string",
  "pitch_summary": "string",
  "created_at": "ISO8601 string"
}
```

**Errors**
- `400` — missing required field
- `409` — email already exists

---

## 2. POST /api/applications/batch
Upload array of applications. Triggers agent scoring pipeline.

**Request body** `application/json`
```json
{
  "applications": [
    {
      "founder_id": "string",
      "answers": {
        "problem": "string",
        "solution": "string",
        "traction": "string",
        "ask": "string"
      }
    }
  ]
}
```

**Response 202**
```json
{
  "batch_id": "string",
  "status": "processing",
  "count": 1
}
```

**Errors**
- `400` — malformed array or missing fields
- `404` — founder_id not found

---

## 3. GET /api/applications/:batch_id/status
Poll scoring status for a batch.

**Response 200**
```json
{
  "batch_id": "string",
  "status": "processing" | "complete" | "failed",
  "completed": 3,
  "total": 10
}
```

---

## 4. GET /api/founders/:id/score
Get the AI score for a scored founder.

**Response 200**
```json
{
  "founder_id": "string",
  "score": 82,              // integer 0–100
  "tier": "string",         // "top" | "mid" | "pass"
  "breakdown": {
    "problem_clarity": 20,  // 0–25
    "solution_strength": 22,
    "traction": 18,
    "team_fit": 22
  },
  "summary": "string",      // 2–3 sentence AI summary
  "scored_at": "ISO8601 string"
}
```

**Errors**
- `404` — founder not found
- `202` — scoring still in progress

---

## 5. GET /api/founders
List all founders. Supports filtering.

**Query params**
| Param    | Type   | Example         |
|----------|--------|-----------------|
| tier     | string | `?tier=top`     |
| stage    | string | `?stage=seed`   |
| industry | string | `?industry=fintech` |

**Response 200**
```json
{
  "founders": [
    {
      "id": "string",
      "name": "string",
      "company_name": "string",
      "stage": "string",
      "industry": "string",
      "score": 82,
      "tier": "top"
    }
  ],
  "total": 42
}
```

---

## 6. POST /agent/score  *(Person B's service)*
Called internally by the backend only — NOT by the frontend.

**Request body** `application/json`
```json
{
  "founder_id": "string",
  "answers": {
    "problem": "string",
    "solution": "string",
    "traction": "string",
    "ask": "string"
  }
}
```

**Response 200**
```json
{
  "founder_id": "string",
  "score": 82,
  "tier": "top" | "mid" | "pass",
  "breakdown": {
    "problem_clarity": 20,
    "solution_strength": 22,
    "traction": 18,
    "team_fit": 22
  },
  "summary": "string"
}
```

---

## Field name reference (everyone use these exactly)

| Field            | Type    | Used in                        |
|------------------|---------|--------------------------------|
| `founder_id`     | string  | all endpoints                  |
| `batch_id`       | string  | batch endpoints                |
| `company_name`   | string  | founder object                 |
| `pitch_summary`  | string  | POST /api/founders             |
| `score`          | integer | score response                 |
| `tier`           | string  | score response, list filter    |
| `breakdown`      | object  | score response                 |
| `scored_at`      | string  | ISO8601 datetime               |
| `created_at`     | string  | ISO8601 datetime               |

---

## Rules
- Field names are **snake_case** everywhere — no exceptions
- Dates are always **ISO8601** strings
- The frontend never calls `/agent/score` directly — backend only
- If you change anything here, update this file first, then tell the team
