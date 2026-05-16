const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/founders
router.post('/', async (req, res) => {
  try {
    const { name, email, company_name, stage, industry, pitch_summary } = req.body;

    if (!name || !email || !company_name || !stage || !industry) {
      return res.status(400).json({ error: 'Missing required field: name, email, company_name, stage, industry' });
    }

    const founder = await prisma.founder.create({
      data: { name, email, company_name, stage, industry, pitch_summary }
    });

    res.status(201).json({
      id:            founder.id,
      name:          founder.name,
      email:         founder.email,
      company_name:  founder.company_name,
      stage:         founder.stage,
      industry:      founder.industry,
      pitch_summary: founder.pitch_summary,
      created_at:    founder.created_at
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET /api/founders
router.get('/', async (req, res) => {
  try {
    const { tier, stage, industry } = req.query;

    const founders = await prisma.founder.findMany({
      where: {
        ...(stage    && { stage }),
        ...(industry && { industry })
      },
      include: {
        applications: {
          select: { score: true, tier: true },
          orderBy: { created_at: 'desc' },
          take: 1
        }
      },
      orderBy: { created_at: 'desc' }
    });

    let result = founders.map(f => ({
      id:           f.id,
      name:         f.name,
      company_name: f.company_name,
      stage:        f.stage,
      industry:     f.industry,
      score:        f.applications[0]?.score ?? null,
      tier:         f.applications[0]?.tier  ?? null
    }));

    if (tier) {
      result = result.filter(f => f.tier === tier);
    }

    res.json({ founders: result, total: result.length });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/founders/:id/score
router.get('/:id/score', async (req, res) => {
  try {
    const founder = await prisma.founder.findUnique({
      where: { id: req.params.id }
    });

    if (!founder) return res.status(404).json({ error: 'Founder not found' });

    const application = await prisma.application.findFirst({
      where: { founder_id: req.params.id },
      orderBy: { created_at: 'desc' }
    });

    if (!application) return res.status(404).json({ error: 'No application found' });

    if (application.status === 'processing') {
      return res.status(202).json({ message: 'Scoring still in progress' });
    }

    res.json({
      founder_id: application.founder_id,
      score:      application.score,
      tier:       application.tier,
      breakdown: {
        problem_clarity:   application.problem_clarity,
        solution_strength: application.solution_strength,
        traction:          application.traction_score,
        team_fit:          application.team_fit
      },
      summary:   application.summary,
      scored_at: application.scored_at
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;