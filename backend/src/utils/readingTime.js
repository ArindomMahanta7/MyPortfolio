const WORDS_PER_MINUTE = 200;

const readingTime = (content) => {
  if (!content || typeof content !== "string") {
    return 1;
  }

  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

export default readingTime;