const fs = require('fs');
const synonyms = require('synonyms');
const thesaurus = require('thesaurus');

const inputFile = process.argv[2];
let ignoredWords = [];

const keywordsFile = 'keywords.list';

if (fs.existsSync(keywordsFile)) {
  const keywords = fs.readFileSync(keywordsFile, 'utf8').split('\n');
  ignoredWords = ignoredWords.concat(keywords.map((keyword) => keyword.trim()));
}

if (!inputFile) {
  console.error('Please provide an input Typescript file');
  process.exit(1);
}

const input = fs.readFileSync(inputFile, 'utf8');

const swaps = {};

const ignoredWordsRegex = new RegExp(`(?:^|\\s+)(?!${ignoredWords.join('|')})([a-z][a-z0-9]*|[A-Z][a-z0-9]*)+`, 'g');
const output = input.replace(ignoredWordsRegex, (match) => {
  const names = match.match(/([a-z][a-z0-9]*|[A-Z][a-z0-9]*)/g);
  const replacements = names.map((name) => {
    const syns = thesaurus.find(name);
    if (!swaps[name]) {
      if (!syns || syns.length === 0 || syns === undefined) {
        return name; // no synonyms found
      }
      console.log(`Synonyms for ${name}: ${syns}`);
    } else {
      return swaps[name]; // already replaced
    }

    const replacement = syns[Math.floor(Math.random() * syns.length)];
    swaps[name] = replacement;
    console.log(`Replacing ${name} with ${replacement}`);
    return replacement;
  });
  return ' ' + replacements.join('');
});

const outputFilename = inputFile.replace(/\.ts$/, '-sanitized.ts');
fs.writeFileSync(outputFilename, output);
console.log(`Output written to ${outputFilename}`);
