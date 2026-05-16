const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/linkages
router.post('/', async (req, res) => {
  try {
    const { founder_id, mentor_id, cohort, notes } = req.body;

    if (!founder_id || !mentor_id || !cohort) {
      return res.status(400).json({ error: 'founder_id, mentor_id and cohort are required' });
    }

    const founder = await prisma.founder.findUnique({ where: { id: founder_id } });
    if (!founder) return res.status(404).json({ error: 'Founder not found' });

    const mentor = await prisma.mentor.findUnique({ where: { id: mentor_id } });
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    if (mentor.current_load >= mentor.capacity) {
      return res.status(400).json({ error: 'Mentor is at full capacity' });
    }

    const linkage = await prisma.linkage.create({
      data: { founder_id, mentor_id, cohort, notes, outcome: 'ongoing' },
      include: {
        founder: { select: { name: true, company_name: true, industry: true } },
        mentor:  { select: { name: true, expertise: true, success_rate: true } }
      }
    });

    await prisma.mentor.update({
      where: { id: mentor_id },
      data:  { current_load: { increment: 1 } }
    });

    res.status(201).json({
      success:    true,
      linkage_id: linkage.id,
      founder:    linkage.founder,
      mentor:     linkage.mentor,
      cohort:     linkage.cohort,
      outcome:    linkage.outcome,
      created_at: linkage.created_at
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/linkages
router.get('/', async (req, res) => {
  try {
    const linkages = await prisma.linkage.findMany({
      include: {
        founder: { select: { name: true, company_name: true, industry: true } },
        mentor:  { select: { name: true, expertise: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ linkages, total: linkages.length });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/linkages/:id/outcome
router.patch('/:id/outcome', async (req, res) => {
  try {
    const { outcome } = req.body;
    const valid = ['ongoing', 'graduated', 'dropped-out', 'raised-funding'];

    if (!valid.includes(outcome)) {
      return res.status(400).json({ error: `outcome must be one of: ${valid.join(', ')}` });
    }
    

    const linkage = await prisma.linkage.update({
      where: { id: req.params.id },
      data:  { outcome }
    });

    const allLinkages = await prisma.linkage.findMany({
      where: { mentor_id: linkage.mentor_id, outcome: { not: 'ongoing' } }
    });

    const successCount = allLinkages.filter(l =>
      ['graduated', 'raised-funding'].includes(l.outcome)
    ).length;

    await prisma.mentor.update({
      where: { id: linkage.mentor_id },
      data: {
        success_rate: allLinkages.length > 0 ? successCount / allLinkages.length : 0,
        past_cohorts: { increment: 1 },
        current_load: { decrement: 1 }
      }
    });

    res.json({ success: true, linkage });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;