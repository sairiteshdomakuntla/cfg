const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversations,
} = require("../../controller/conversationController");

router.get("/",  getConversations);
router.post("/", createConversation);

module.exports = router;
