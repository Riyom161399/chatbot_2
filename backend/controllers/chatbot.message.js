// chatbot.message.js

import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";

//import intentsData from "../nlp/intents.json" assert { type: "json" };
import fs from "fs";
import path from "path";

const intentsPath = path.resolve("./nlp/intents.json");
const intentsData = JSON.parse(fs.readFileSync(intentsPath, "utf-8"));

import { initNLP, classifyIntent } from "../nlp/intentClassifier.js";

// Initialize NLP once at the start
initNLP(intentsData.intents);

export const Message = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    // Save user message to DB
    await User.create({ sender: "user", text });

    // Classify intent using NLP
    const result = classifyIntent(text, intentsData.intents);

    // Get the response text from classification
    const botResponse =
      result.response ||
      "I'm not sure about that. Could you try rephrasing? 🤔";

    // Optional: log detected intent for debugging
    console.log(
      "Detected Intent:",
      result.intent,
      "Confidence:",
      result.confidence
    );

    // Save bot response to DB
    await Bot.create({ text: botResponse });

    // Return response to frontend
    return res.status(200).json({
      userMessage: text,
      botMessage: botResponse,
      intentDetected: result.intent,
      confidence: result.confidence,
    });
  } catch (error) {
    console.log("Error in Message Controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
