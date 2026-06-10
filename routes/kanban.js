const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const protect = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// GET all cards
router.get('/', protect, async (req, res) => {
  try {
    const cards = await prisma.kanbanCard.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// POST create card
router.post('/', protect, async (req, res) => {
  const { title, tag } = req.body;
  try {
    const card = await prisma.kanbanCard.create({
      data: { title, tag, column: 'To Study', userId: req.user.userId }
    });
    res.status(201).json(card);
  } catch (err) {
    console.error("🔥 KANBAN POST CRASH:", err); // This is what we need!
    res.status(500).json({ error: 'Failed to create card', details: err.message });
  }
});

// PATCH move card to new column
router.patch('/:id', protect, async (req, res) => {
  const { column } = req.body;
  try {
    const card = await prisma.kanbanCard.update({
      where: { id: req.params.id },
      data: { column }
    });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to move card' });
  }
});

// DELETE card
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.kanbanCard.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;