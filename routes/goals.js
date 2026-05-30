const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const protect = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// GET all goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// POST create goal
router.post('/', protect, async (req, res) => {
  const { title, target, unit, week } = req.body;
  try {
    const goal = await prisma.goal.create({
      data: { title, target: parseInt(target), unit, week, userId: req.user.userId }
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// PATCH update progress
router.patch('/:id', protect, async (req, res) => {
  const { current } = req.body;
  try {
    const goal = await prisma.goal.update({
      where: { id: req.params.id },
      data: { current: parseInt(current) }
    });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// DELETE goal
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.goal.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;