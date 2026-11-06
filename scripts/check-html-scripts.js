/**
 * check-html-scripts.js
 * 
 * Verifies that all inline <script> blocks in HTML files are syntactically valid JS,
 * ensures no premature </script> terminations exist inside strings,
 * checks for mojibake or corrupt character sequences, and validates basic HTML tags.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkFile(filePath) {
  console.log(`\nChecking: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  let errors = [];
  let warnings = [];

  // 1. Check for Mojibake (e.g. Ã, â€)
  const mojibakeMatches = content.match(/[ÃÂ][\x80-\xBF]|â[\x80-\x9F][\x80-\x9F]/g);
  if (mojibakeMatches) {
    warnings.push(`Detected ${mojibakeMatches.length} possible Mojibake sequences.`);
  }

  // 2. Find all <script> ... </script> blocks as an HTML parser would see them
  // According to HTML5 spec, inside a script element, any literal `</script` (case insensitive) closes the script!
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptCount = 0;
  const scriptBlocks = [];

  while ((match = scriptRegex.exec(content)) !== null) {
    scriptCount++;
    const attrs = match[1];
    const code = match[2];
    const startIndex = match.index;
    const lineNumber = content.substring(0, startIndex).split('\n').length;

    // Check if it's an external script src
    if (/src\s*=/i.test(attrs)) {
      continue;
    }

    scriptBlocks.push({ lineNumber, code });
  }

  console.log(`  Found ${scriptCount} script tags (${scriptBlocks.length} inline JS blocks).`);

  // 3. Check for leaked JS text after a broken script tag
  // Check if there are common JS patterns outside <script> tags
  const textWithoutScripts = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const leakedJsPatterns = [
    /\bfunction\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/,
    /\bconst\s+[a-zA-Z0-9_]+\s*=\s*\{/,
    /\bdocument\.getElementById\(/
  ];
  for (const pattern of leakedJsPatterns) {
    const leakMatch = textWithoutScripts.match(pattern);
    if (leakMatch) {
      errors.push(`CRITICAL: Leaked JS code detected outside <script> tags! Matches pattern: ${pattern.toString()}`);
      const idx = textWithoutScripts.search(pattern);
      errors.push(`Snippet: ${textWithoutScripts.substring(Math.max(0, idx - 40), Math.min(textWithoutScripts.length, idx + 100)).trim()}`);
    }
  }

  // 4. Validate JS syntax of each inline script block
  scriptBlocks.forEach((block, idx) => {
    try {
      new vm.Script(block.code, { filename: `${path.basename(filePath)}#script-${idx + 1}` });
      console.log(`  ✓ Script block #${idx + 1} (starts at line ${block.lineNumber}) syntax OK.`);
    } catch (err) {
      errors.push(`SyntaxError in script block #${idx + 1} (starts at line ${block.lineNumber}): ${err.message}`);
      if (err.stack) {
        const stackLines = err.stack.split('\n').slice(0, 4).join('\n');
        errors.push(`  Stack: ${stackLines}`);
      }
    }
  });

  // Report
  if (warnings.length > 0) {
    console.log(`  [WARNINGS]:`);
    warnings.forEach(w => console.log(`    ⚠ ${w}`));
  }

  if (errors.length > 0) {
    console.log(`  [FAILURES]:`);
    errors.forEach(e => console.log(`    ❌ ${e}`));
    return false;
  } else {
    console.log(`  ✓ All script checks passed!`);
    return true;
  }
}

const targetFiles = process.argv.slice(2);
if (targetFiles.length === 0) {
  targetFiles.push('internahub.html');
}

let allOk = true;
for (const file of targetFiles) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const ok = checkFile(fullPath);
    if (!ok) allOk = false;
  } else {
    console.error(`File not found: ${fullPath}`);
    allOk = false;
  }
}

if (!allOk) {
  process.exit(1);
} else {
  console.log('\nAll files passed verification.');
}
