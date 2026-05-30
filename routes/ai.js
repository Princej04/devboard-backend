const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');
const protect = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest', protect, async (req, res) => {
  try {
    // Fetch user's solved problems
    const problems = await prisma.problem.findMany({
      where: { userId: req.user.userId }
    });

    if (problems.length === 0) {
      return res.json({
        suggestion: "You haven't logged any problems yet. Start by solving a few problems across different topics, then come back for personalized suggestions!"
      });
    }

    // Count problems per topic
    const topicCount = {};
    problems.forEach(p => {
      topicCount[p.topic] = (topicCount[p.topic] || 0) + 1;
    });

    // Find weak topics (solved less than 3 problems)
    const allTopics = ['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'DP', 'Recursion', 'Sorting', 'Binary Search'];
    const weakTopics = allTopics.filter(t => (topicCount[t] || 0) < 3);

    // Build prompt
    const prompt = `
      You are a DSA (Data Structures & Algorithms) coach helping a student prepare for product company interviews.

      Here is their current progress:
      - Total problems solved: ${problems.length}
      - Problems by topic: ${JSON.stringify(topicCount)}
      - Weak topics (less than 3 problems solved): ${weakTopics.join(', ') || 'None'}

      Give a short, encouraging, and actionable suggestion (max 5 lines):
      1. Point out their strongest topic
      2. Pick the most important weak topic and suggest 2-3 specific problem names to practice
      3. End with a motivating one-liner

      Keep the tone friendly and direct. No markdown, no bullet symbols, plain text only.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ suggestion: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI suggestion failed' });
  }
});

module.exports = router;