const { answerAIChat } = require('../services/aiService');

const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const aiResult = await answerAIChat(message, history);
    return res.json({
      success: true,
      reply: aiResult.reply,
      suggestions: aiResult.suggestions
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'AI Chat service unavailable.' });
  }
};

module.exports = { chatWithAI };
