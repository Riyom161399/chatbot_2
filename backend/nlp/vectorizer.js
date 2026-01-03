import natural from "natural";

const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

/**
 * Train TF-IDF using example sentences
 */
export function trainVectorizer(intents) {
  intents.forEach((intent) => {
    intent.examples.forEach((sentence) => {
      tfidf.addDocument(sentence);
    });
  });
}

/**
 * Convert a sentence into a TF-IDF vector
 */
export function vectorize(sentence) {
  const vector = [];
  tfidf.tfidfs(sentence, (i, measure) => {
    vector.push(measure);
  });
  return vector;
}
