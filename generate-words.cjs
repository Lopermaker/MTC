const fs = require('fs');
const Filter = require('bad-words');

const filter = new Filter();
const wordsRaw = fs.readFileSync('node_modules/an-array-of-english-words/index.json', 'utf-8');
const words = JSON.parse(wordsRaw);

// Filter for 5-letter and 6-letter words, no bad words
const fiveLetterWords = [];
const sixLetterWords = [];

for (const word of words) {
  if (word.length === 5 || word.length === 6) {
    if (filter.isProfane(word)) {
      continue;
    }
    if (word.length === 5) {
      fiveLetterWords.push(word.toUpperCase());
    } else {
      sixLetterWords.push(word.toUpperCase());
    }
  }
}

const data = {
  classic: fiveLetterWords,
  insanity: sixLetterWords
};

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/words.json', JSON.stringify(data));
console.log(`Generated ${fiveLetterWords.length} 5-letter words and ${sixLetterWords.length} 6-letter words.`);
