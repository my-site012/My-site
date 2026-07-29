const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '..', 'app'),
  path.join(__dirname, '..', 'components')
];

function optimizeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace <Link with <Link prefetch={false} if it doesn't already contain prefetch=
  // We match <Link followed by attributes and closing bracket/tag.
  const linkRegex = /<Link\b([^>]*?)>/g;

  content = content.replace(linkRegex, (match, attributes) => {
    // Check if prefetch is already specified
    if (attributes.includes('prefetch=')) {
      return match;
    }
    const trimmed = attributes.trim();
    if (trimmed.length > 0) {
      return `<Link prefetch={false} ${trimmed}>`;
    } else {
      return `<Link prefetch={false}>`;
    }
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Optimized: ${filePath}`);
  }
}

function traverse(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      optimizeFile(fullPath);
    }
  });
}

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    traverse(dir);
  }
});

console.log('Link optimization completed!');
