import { preprocess } from "./preprocess.js";
import { trainVectorizer } from "./vectorizer.js";
import stringSimilarity from "string-similarity";

/**
 * Initialize NLP system (run once when server starts)
 */
export function initNLP(intents) {
  trainVectorizer(intents);
}

/**
 * Classify user intent
 */
export function classifyIntent(text, intents) {
  const cleanText = preprocess(text);

  const allExamples = intents.flatMap((intent) => intent.examples);

  const result = stringSimilarity.findBestMatch(cleanText, allExamples);
  const confidence = result.bestMatch.rating;
  const matchedSentence = result.bestMatch.target;

  if (confidence < 0.5) {
    return {
      intent: null,
      response: "I'm not sure about that 🤔",
      confidence,
    };
  }

  const matchedIntent = intents.find((intent) =>
    intent.examples.includes(matchedSentence)
  );

  return {
    intent: matchedIntent.intent,
    response: matchedIntent.response,
    confidence,
  };
}
