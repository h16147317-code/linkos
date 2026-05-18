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

function fallbackScore(industry, pitch) {
  const ind = (industry || '').toLowerCase();
  const p   = (pitch   || '').toLowerCase();
  if (ind.includes('health'))   return 70;
  if (ind.includes('fintech') || p.includes('finance')) return 72;
  if (ind.includes('agritech')) return 65;
  if (ind.includes('cleantech')) return 68;
  if (ind.includes('edtech'))   return 66;
  if (p.includes('ai') || p.includes('tech')) return 65;
  return 60;
}

async function scoreInBackground(batch_id, applications) {
  // Fetch full founder details for all applications in one query
  const founderIds = applications.map(a => a.founder_id);
  const founders = await prisma.founder.findMany({
    where: { id: { in: founderIds } }
  });
  const founderMap = Object.fromEntries(founders.map(f => [f.id, f]));

  const payload = {
    applications: applications.map(app => {
      const founder = founderMap[app.founder_id] || {};
      return {
        id:            app.founder_id,
        company_name:  founder.company_name  || '',
        industry:      founder.industry      || '',
        stage:         founder.stage         || '',
        pitch_summary: founder.pitch_summary || '',
        problem:       app.answers?.problem  || '',
        solution:      app.answers?.solution || '',
        traction:      app.answers?.traction || '',
        ask:           app.answers?.ask      || ''
      };
    }),
    programme: {
      id:             'prog-cip-catalyser-cohort-12',
      name:           'CIP Catalyser',
      criteria:       'Malaysian tech startup',
      cohort_number:  12
    },
    mentors:         [],
    history_context: ''
  };

  let agentResults = [];
  try {
    const agentRes = await axios.post(`${AGENT_URL}/agent/process-batch`, payload);
    agentResults = agentRes.data.scored_applications || [];
  } catch (err) {
    // Agent unreachable — apply backend fallback for every application
    for (const app of applications) {
      const founder = founderMap[app.founder_id] || {};
      const score   = fallbackScore(founder.industry, founder.pitch_summary);
      const tier    = score >= 75 ? 'top' : score >= 50 ? 'mid' : 'pass';
      await prisma.application.updateMany({
        where: { founder_id: app.founder_id, batch_id },
        data: {
          score,
          tier,
          confidence: 'low',
          flags:      [],
          summary:    'Pending AI review - will update automatically',
          scored_at:  new Date(),
          status:     'complete'
        }
      });
    }
    await prisma.batch.update({
      where: { id: batch_id },
      data: { status: 'complete', completed: applications.length }
    });
    return;
  }

  // Index results by founder_id (agent returns id = founder_id)
  const resultMap = Object.fromEntries(agentResults.map(r => [r.id, r]));

  const largeBatch = applications.length > 5;
  let completed = 0;

  for (const app of applications) {
    const result  = resultMap[app.founder_id];
    const founder = founderMap[app.founder_id] || {};

    if (result) {
      const { score, confidence, reasoning, flags } = result;
      const tier = score >= 75 ? 'top' : score >= 50 ? 'mid' : 'pass';
      await prisma.application.updateMany({
        where: { founder_id: app.founder_id, batch_id },
        data: {
          score,
          tier,
          confidence: confidence || null,
          flags:      flags      || [],
          summary:    reasoning  || null,
          scored_at:  new Date(),
          status:     'complete'
        }
      });
    } else {
      // Result missing for this founder — use backend fallback
      const score = fallbackScore(founder.industry, founder.pitch_summary);
      const tier  = score >= 75 ? 'top' : score >= 50 ? 'mid' : 'pass';
      await prisma.application.updateMany({
        where: { founder_id: app.founder_id, batch_id },
        data: {
          score,
          tier,
          confidence: 'low',
          flags:      [],
          summary:    'Pending AI review - will update automatically',
          scored_at:  new Date(),
          status:     'complete'
        }
      });
    }

    completed++;
    await prisma.batch.update({
      where: { id: batch_id },
      data: { completed }
    });

    if (largeBatch) {
      await new Promise(r => setTimeout(r, 4000));
    }
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