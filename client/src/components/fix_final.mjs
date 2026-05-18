import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('./Chat.jsx', 'utf8');
// Replace the 📄 emoji (U+1F4C4) in the JS string
c = c.replace('`\u{1F4C4} ${file.name}`', '`[File] ${file.name}`');
writeFileSync('./Chat.jsx', c, 'utf8');
console.log('Done. Checking for any remaining emojis...');
const emojiRegex = /[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu;
const matches = [...c.matchAll(emojiRegex)];
if (matches.length === 0) {
  console.log('✅ Zero emojis remaining in Chat.jsx!');
} else {
  const lines = c.split('\n');
  matches.forEach(m => {
    const lineNum = c.substring(0, m.index).split('\n').length;
    console.log('Still found at line ' + lineNum + ': ' + lines[lineNum-1].trim().substring(0,90));
  });
}
