const fs = require('fs');
const synonyms = require('synonyms');
const { replace } = require('thesaurus');
const thesaurus = require('thesaurus');

const inputFile = process.argv[2];
let ignoredWords = [];

const filextension = inputFile.split('.').pop();
const folderPath = `keywords/${filextension}`;

if (!fs.existsSync(folderPath)) {
  //code to exit program because the folder does not exist
  console.error('The keywords for this file extension have not been added yet.');
  console.error(`Please a folder in the keywords directory called ${filextension} and add a list.txt file with the keywords you want to ignore.}`);
  process.exit(1);
}
const commonWordsFile = 'common/common_words.txt';
const keywordsFile = `keywords/${filextension}/list.txt`;

if (fs.existsSync(keywordsFile)) {
  const keywords = fs.readFileSync(keywordsFile, 'utf8').split('\n');
  ignoredWords = ignoredWords.concat(keywords.map((keyword) => keyword.trim()));
}

if (fs.existsSync(commonWordsFile)) {
  const commonWords = fs.readFileSync(commonWordsFile, 'utf8').split('\n');
  ignoredWords = ignoredWords.concat(commonWords.map((common) => common.trim()));
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
    if(name.length === 1) {
      return name;
    } else if (!swaps[name]) {
      if (!syns || syns.length === 0 || syns === undefined) return name; // no synonyms found
    } else {
      return swaps[name]; // already replaced
    }
    const filteredSyns = syns.filter(syn => !syn.includes(' '));
    const replacement = filteredSyns[Math.floor(Math.random() * filteredSyns.length)];
    swaps[name] = replacement;
    
    console.log(`Replacing ${name} with ${replacement}`);
    return replacement;
  });
  return ' ' + replacements.join('');
});

const outputFilename = inputFile.replace(/\.ts$/, '-sanitized.ts');
fs.writeFileSync(outputFilename, output);
console.log(`Output written to ${outputFilename}`);
