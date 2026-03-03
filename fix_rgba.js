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

      // The problem: rgba(255,255,255,0.5) is hardcoded white with opacity.
      // In light mode, this needs to be black with opacity.
      // Easiest solution: swap them to use Tailwind semantic CSS variables we defined
      // var(--text-foreground) or var(--color-foreground) but handled via JS for inline styles.

      // Let's replace inline styles that use rgba(255,255,255,X)
      // We will map rgba(255,255,255,0.x) -> rgba(var(--color-foreground-rgb), 0.x)
      // Since Next/Tailwind v4 handles colors differently, we can just use tailwind classes where possible,
      // or map to a CSS variable.

      // Actually, a simpler approach is changing it to use Tailwind classes:
      // text-white/50 -> text-foreground/50
      // That was done. But inline styles: style={{ color: "rgba(255,255,255,0.5)" }} missed it.
      // Let's convert them to CSS variables var(--color-foreground) with opacity or use standard text colors.

      // Convert inline rgba(255,255,255, X) to dynamic color check or tailwind values
      // We'll replace it with a CSS custom property approach. For text, it's var(--color-foreground).
      // However inline rgba with variables needs `color-mix` or specific RGB vars.

      // Let's replace common patterns:
      content = content.replace(/rgba\(255,255,255,0\.([0-9]+)\)/g, 'rgba(var(--foreground-rgb, 255,255,255), 0.$1)');
      
      // We need to make sure --foreground-rgb exists in globals.css

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('e:/ReactJS/porto/src/components');
console.log("Replaced rgba statements.");
