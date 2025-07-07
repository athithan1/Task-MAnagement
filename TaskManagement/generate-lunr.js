// generate-lunr.js
// Node.js script to auto-generate lunr.json from Hugo content frontmatter
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirs = [
  'content/students',
  'content/teachers',
  'content/tasks',
  'content/subjects',
  'content' // for _index.md
];

const sectionToUri = {
  students: '/students/',
  teachers: '/teachers/',
  tasks: '/tasks/',
  subjects: '/subjects/',
  '': '/' // for _index.md
};

function getUri(section, filename) {
  if (filename === '_index.md') return sectionToUri[section];
  const name = path.basename(filename, '.md');
  return sectionToUri[section] + name + '/';
}

let results = [];

for (const dir of contentDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fm = matter.read(fullPath);
    if (fm.data.title) {
      const section = path.basename(dir);
      results.push({
        title: fm.data.title,
        uri: getUri(section === 'content' ? '' : section, file)
      });
    }
  }
}

// Ensure static directory exists
if (!fs.existsSync('static')) {
  fs.mkdirSync('static');
}

fs.writeFileSync('static/lunr.json', JSON.stringify(results, null, 2));
console.log('lunr.json generated with', results.length, 'entries.');
