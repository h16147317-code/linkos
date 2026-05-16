const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/memory
router.get('/', async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        linkages: { select: { outcome: true } }
      },
      orderBy: { success_rate: 'desc' }
    });

    const mentor_utilisation = mentors.map(m => ({
      id:              m.id,
      name:            m.name,
      industry:        m.industry,
      capacity:        m.capacity,
      current_load:    m.current_load,
      utilisation_pct: m.capacity > 0
        ? Math.round((m.current_load / m.capacity) * 100)
        : 0,
      success_rate:    m.success_rate,
      cohort_count:    m.past_cohorts,
      availability:    m.availability,
      total_matches:   m.linkages.length,
      success_count:   m.linkages.filter(l =>
        ['graduated', 'raised-funding'].includes(l.outcome)
      ).length
    }));

    const patterns = await prisma.cohortPattern.findMany({
      orderBy: { detected_at: 'desc' },
      take: 20
    });

    const total_founders     = await prisma.founder.count();
    const total_applications = await prisma.application.count();
    const total_linkages     = await prisma.linkage.count();
    const successful_outcomes = await prisma.linkage.count({
      where: { outcome: { in: ['graduated', 'raised-funding'] } }
    });

    res.json({
      overview: {
        total_founders,
        total_applications,
        total_linkages,
        successful_outcomes
      },
      mentor_utilisation,
      cohort_patterns: patterns.map(p => ({
        id:           p.id,
        pattern_text: p.pattern_text,
        severity:     p.severity,
        detected_at:  p.detected_at
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/memory/patterns
router.post('/patterns', async (req, res) => {
  try {
    const { pattern_text, severity } = req.body;

    if (!pattern_text) {
      return res.status(400).json({ error: 'pattern_text is required' });
    }

    const pattern = await prisma.cohortPattern.create({
      data: { pattern_text, severity: severity || 'info' }
    });

    res.status(201).json({ success: true, pattern });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;