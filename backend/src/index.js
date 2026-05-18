const express = require('express');
const cors = require('cors');
require('dotenv').config();

const foundersRouter     = require('./routes/founders');
const applicationsRouter = require('./routes/applications');
const mentorsRouter      = require('./routes/mentors');
const linkagesRouter     = require('./routes/linkages');
const memoryRouter       = require('./routes/memory');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'LinkOS Backend running',
    port:   PORT,
    endpoints: [
      'POST   /api/founders',
      'GET    /api/founders',
      'GET    /api/founders/:id/score',
      'POST   /api/applications/batch',
      'GET    /api/applications/:batch_id/status',
      'GET    /api/mentors',
      'POST   /api/mentors',
      'POST   /api/linkages',
      'GET    /api/linkages',
      'PATCH  /api/linkages/:id/outcome',
      'GET    /api/memory',
      'POST   /api/memory/patterns'
    ]
  });
});

app.use('/api/founders',     foundersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/mentors',      mentorsRouter);
app.use('/api/linkages',     linkagesRouter);
app.use('/api/memory',       memoryRouter);

app.listen(PORT, () => {
  console.log(`🚀 LinkOS backend running on http://localhost:${PORT}`);
  console.log(`📋 All endpoints: http://localhost:${PORT}/`);
});