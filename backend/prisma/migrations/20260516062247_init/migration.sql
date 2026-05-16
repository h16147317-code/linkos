-- CreateTable
CREATE TABLE "Founder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "pitch_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Founder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "founder_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "problem" TEXT,
    "solution" TEXT,
    "traction" TEXT,
    "ask" TEXT,
    "score" INTEGER,
    "tier" TEXT,
    "problem_clarity" INTEGER,
    "solution_strength" INTEGER,
    "traction_score" INTEGER,
    "team_fit" INTEGER,
    "summary" TEXT,
    "scored_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "total" INTEGER NOT NULL,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expertise" TEXT[],
    "industry" TEXT[],
    "capacity" INTEGER NOT NULL DEFAULT 3,
    "current_load" INTEGER NOT NULL DEFAULT 0,
    "past_cohorts" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Linkage" (
    "id" TEXT NOT NULL,
    "founder_id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "cohort" INTEGER NOT NULL,
    "outcome" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Linkage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CohortPattern" (
    "id" TEXT NOT NULL,
    "pattern_text" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CohortPattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Founder_email_key" ON "Founder"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_email_key" ON "Mentor"("email");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_founder_id_fkey" FOREIGN KEY ("founder_id") REFERENCES "Founder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linkage" ADD CONSTRAINT "Linkage_founder_id_fkey" FOREIGN KEY ("founder_id") REFERENCES "Founder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linkage" ADD CONSTRAINT "Linkage_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
