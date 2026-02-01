// A simple list of common English words for autocomplete
const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "hello", "help", "please",
  "sorry", "thanks", "yes", "friend", "family", "learn", "sign", "language",
  "awesome", "cool", "world", "love", "peace", "create", "detect", "computer"
];

export function getSuggestions(prefix: string, max: number = 5): string[] {
  if (!prefix || prefix.length < 1) return [];
  const lowerPrefix = prefix.toLowerCase();
  
  // exact match doesn't need suggestion usually, but let's include extensions
  return COMMON_WORDS
    .filter(word => word.startsWith(lowerPrefix) && word !== lowerPrefix)
    .sort((a, b) => a.length - b.length) // shortest first
    .slice(0, max);
}
