const Conversation = require("../models/Conversation");

// POST /api/conversations
const createConversation = async (req, res) => {
  try {
    const { studentId, date, parent, educator, improvement, conclusion } = req.body;
    if (!studentId || !date || !parent || !educator || !improvement) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const convo = await Conversation.create({
      studentId,
      date: new Date(date),
      parent,
      educator,
      improvement,
      conclusion,
    });
    res.status(201).json(convo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/conversations?studentId=abc
const getConversations = async (req, res) => {
  try {
    const filter = req.query.studentId ? { studentId: req.query.studentId } : {};
    const list = await Conversation.find(filter).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createConversation, getConversations };
