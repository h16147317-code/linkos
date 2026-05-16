const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const router = express.Router();
const prisma = new PrismaClient();

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8000';

// POST /api/applications/batch
router.post('/batch', async (req, res) => {
  try {
    const { applications } = req.body;

    if (!applications || !Array.isArray(applications) || applications.length === 0) {
      return res.status(400).json({ error: 'Malformed array or missing fields' });
    }

    for (const app of applications) {
      if (!app.founder_id) {
        return res.status(400).json({ error: 'Missing founder_id' });
      }
      const founder = await prisma.founder.findUnique({ where: { id: app.founder_id } });
      if (!founder) {
        return res.status(404).json({ error: `founder_id not found: ${app.founder_id}` });
      }
    }

    const batch = await prisma.batch.create({
      data: { total: applications.length, status: 'processing' }
    });

    for (const app of applications) {
      await prisma.application.create({
        data: {
          founder_id: app.founder_id,
          batch_id:   batch.id,
          problem:    app.answers?.problem  || null,
          solution:   app.answers?.solution || null,
          traction:   app.answers?.traction || null,
          ask:        app.answers?.ask      || null,
          status:     'processing'
        }
      });
    }

    res.status(202).json({
      batch_id: batch.id,
      status:   'processing',
      count:    applications.length
    });

    scoreInBackground(batch.id, applications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function scoreInBackground(batch_id, applications) {
  let completed = 0;

  for (const app of applications) {
    try {
      const agentRes = await axios.post(`${AGENT_URL}/agent/score`, {
        founder_id: app.founder_id,
        answers: {
          problem:  app.answers?.problem  || '',
          solution: app.answers?.solution || '',
          traction: app.answers?.traction || '',
          ask:      app.answers?.ask      || ''
        }
      });

      const { score, tier, breakdown, summary } = agentRes.data;
      const computedTier = tier || (score >= 75 ? 'top' : score >= 50 ? 'mid' : 'pass');

      await prisma.application.updateMany({
        where: { founder_id: app.founder_id, batch_id },
        data: {
          score,
          tier:              computedTier,
          problem_clarity:   breakdown?.problem_clarity   || null,
          solution_strength: breakdown?.solution_strength || null,
          traction_score:    breakdown?.traction          || null,
          team_fit:          breakdown?.team_fit          || null,
          summary:           summary || null,
          scored_at:         new Date(),
          status:            'complete'
        }
      });

    } catch (err) {
      await prisma.application.updateMany({
        where: { founder_id: app.founder_id, batch_id },
        data: { status: 'failed' }
      });
    }

    completed++;
    await prisma.batch.update({
      where: { id: batch_id },
      data: { completed }
    });
  }

  await prisma.batch.update({
    where: { id: batch_id },
    data: { status: 'complete' }
  });
}

// GET /api/applications/:batch_id/status
router.get('/:batch_id/status', async (req, res) => {
  try {
    const batch = await prisma.batch.findUnique({
      where: { id: req.params.batch_id }
    });

    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    res.json({
      batch_id:  batch.id,
      status:    batch.status,
      completed: batch.completed,
      total:     batch.total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;