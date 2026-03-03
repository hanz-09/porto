const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Tailwind classes
      content = content.replace(/\btext-white\b/g, 'text-foreground');
      content = content.replace(/\btext-white\//g, 'text-foreground/');
      content = content.replace(/\bbg-black\b/g, 'bg-background');
      content = content.replace(/\bbg-black\//g, 'bg-background/');
      content = content.replace(/\bborder-white\//g, 'border-foreground/');
      
      // Selection overrides
      content = content.replace(/\bselection:bg-white\//g, 'selection:bg-foreground/');
      
      // Inline background hex codes
      content = content.replace(/#050508/g, 'var(--bg-primary)');
      content = content.replace(/#0d0d14/g, 'var(--bg-secondary)');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('e:/ReactJS/porto/src/components');
processDir('e:/ReactJS/porto/src/app');
console.log("Done.");
