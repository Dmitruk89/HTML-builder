const fs = require('fs');
const readline = require('readline');
const input = process.stdin;
const output = process.stdout;

let writeableStream = fs.createWriteStream('./02-write-file/text.txt');

const rl = readline.createInterface({ input, output });
rl.write('What\'s up?\n');

rl.addListener('line', (input) => {
  if (input === 'exit') {
    rl.write('See ya!\n');
    process.exit(0);
  }
  writeableStream.write(input + '\n');
});

rl.addListener('close', () => {
  rl.write('See ya!\n');
  process.exit(0);
});