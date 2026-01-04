// intentClassifier.js
import { preprocess } from "./preprocess.js";
import { trainVectorizer, vectorize, cosineSimilarity } from "./vectorizer.js";

/**
 * Initialize NLP system (run once when server starts)
 */
export function initNLP(intents) {
  trainVectorizer(intents);
}

/**
 * Classify user intent using TF-IDF + cosine similarity
 */
export function classifyIntent(text, intents) {
  const cleanText = preprocess(text);
  const inputVector = vectorize(cleanText);

  let bestScore = 0;
  let bestIntent = null;

  intents.forEach((intent) => {
    intent.examples.forEach((example) => {
      const exampleVector = vectorize(example);
      const score = cosineSimilarity(inputVector, exampleVector);

      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });
  });

  if (bestScore < 0.35) {
    return {
      intent: null,
      response: "I'm not sure about that 🤔",
      confidence: bestScore,
    };
  }

  return {
    intent: bestIntent.intent,
    response: bestIntent.response,
    confidence: bestScore,
  };
}
