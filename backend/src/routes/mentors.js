const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/mentors
router.get('/', async (req, res) => {
  try {
    const { industry, available } = req.query;

    const mentors = await prisma.mentor.findMany({
      where: {
        ...(available === 'true' && { availability: true }),
        ...(industry && { industry: { has: industry } })
      },
      include: {
        linkages: { select: { outcome: true } }
      },
      orderBy: { success_rate: 'desc' }
    });

    const result = mentors.map(m => ({
      id:              m.id,
      name:            m.name,
      email:           m.email,
      expertise:       m.expertise,
      industry:        m.industry,
      capacity:        m.capacity,
      current_load:    m.current_load,
      past_cohorts:    m.past_cohorts,
      success_rate:    m.success_rate,
      availability:    m.availability,
      bio:             m.bio,
      utilisation_pct: m.capacity > 0
        ? Math.round((m.current_load / m.capacity) * 100)
        : 0,
      cohort_count:    m.past_cohorts,
      total_linkages:  m.linkages.length,
      success_count:   m.linkages.filter(l =>
        ['graduated', 'raised-funding'].includes(l.outcome)
      ).length
    }));

    res.json({ mentors: result, total: result.length });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/mentors/:id
router.get('/:id', async (req, res) => {
  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: req.params.id },
      include: { linkages: { include: { founder: true } } }
    });

    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    res.json({
      ...mentor,
      utilisation_pct: mentor.capacity > 0
        ? Math.round((mentor.current_load / mentor.capacity) * 100)
        : 0,
      cohort_count: mentor.past_cohorts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/mentors
router.post('/', async (req, res) => {
  try {
    const { name, email, expertise, industry, capacity, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const mentor = await prisma.mentor.create({
      data: { name, email, expertise, industry, capacity, bio }
    });

    res.status(201).json(mentor);

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;