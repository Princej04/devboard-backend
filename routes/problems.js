const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const protect = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// GET all problems for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const problems = await prisma.problem.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// POST create a new problem
router.post('/', protect, async (req, res) => {
  const { title, topic, difficulty, platform, notes } = req.body;
  try {
    const problem = await prisma.problem.create({
      data: { title, topic, difficulty, platform, notes, userId: req.user.userId }
    });
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create problem' });
  }
});

// DELETE a problem
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.problem.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;