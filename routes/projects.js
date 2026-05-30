const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const protect = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// GET all projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST create project
router.post('/', protect, async (req, res) => {
  const { title, description, techStack, githubUrl, liveUrl, status } = req.body;
  try {
    const project = await prisma.project.create({
      data: { title, description, techStack, githubUrl, liveUrl, status, userId: req.user.userId }
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// DELETE project
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;