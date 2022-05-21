const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, 'text.txt');

const text = fs.createWriteStream(filePath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: console.log('Hello! Enter some text end check text.txt'),
});

rl.on('line', (line) => {
  if (line == 'exit') {
    rl.close();
  } else {
    text.write(`${line}\n`);
  }
});

rl.on('close', () => {
  console.log('Bye! Have a nice day!');
  text.end();
});
