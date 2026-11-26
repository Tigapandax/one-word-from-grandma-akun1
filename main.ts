// Entry word: "Roboot" — the typo a grandma would text about AI:
// she means "robot", types one extra "o", and the joke lands in a single word.
// The sealed gate only accepts 1-30 characters of plain text, so every
// check below guards that shape before anything is written out.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "one-word.txt");

function fail(reason: string): never {
  console.error(`INVALID: ${reason}`);
  process.exit(1);
}

if (!existsSync(sourcePath)) fail("one-word.txt is missing next to main.ts");

const raw = readFileSync(sourcePath, "utf8");
const word = raw.trim();

if (word.length === 0) fail("the word is empty");
if (word.length > 30) fail(`the word is ${word.length} characters, over the 30 limit`);
if (/\s/.test(word)) fail("the entry must be a single word with no spaces or line breaks");
if (!/^[A-Za-z]+$/.test(word)) fail("the entry must contain letters only");
if (raw.trim().split(/\r?\n/).length > 1) fail("one-word.txt must hold a single line");
if (Buffer.byteLength(word, "utf8") > 30) fail("the word is over 30 bytes");

const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(targetDir, { recursive: true });
const target = join(targetDir, "entry.txt");
writeFileSync(target, word, "utf8");

console.log(word);
console.log(`WROTE ${word.length} characters to ${target}`);
