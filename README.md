# GPTSanitizer
GPTSanitizer is a Node.js script that sanitizes priority information out of a TypeScript file so that developers can copy and paste code into ChatGPT without revealing confidential data. It is currently not ready for use and should not be considered safe or well thought out.

## Prerequisites
Node.js installed on your system

## Installation
Clone this repository or download the files
Run npm install to install the required dependencies

## Usage
To use the sanitizer, run the following command:

`node sanitizer.js <input_file>`
where input_file is the path to the TypeScript file that you want to sanitize.

The sanitizer will replace all words in the input file that are not in the ignored words list with a randomly selected synonym from a thesaurus. The sanitized output will be written to a new file with the same name as the input file, but with -sanitized appended to the end of the filename.

The ignored words list is defined in the ignoredWords array at the beginning of the sanitizer.js file.

## Contributors
Scott White
ChatGPT (OpenAI)
