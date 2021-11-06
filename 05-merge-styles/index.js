const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');

const originStylePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundle() {
  const dirContent = await fsProm.readdir(originStylePath);
  const cssFiles = dirContent.filter(file => path.extname(file) === '.css');
  const writable = fs.createWriteStream(bundlePath, 'utf8');

  mergeStyles(cssFiles, writable);
}

function mergeStyles(styles = [], writable) {
  if (styles.length === 0) return writable.end();

  const currFile = path.resolve(originStylePath, styles.shift());
  const readable = fs.createReadStream(currFile, 'utf8');

  readable.pipe(writable, { end: false });
  readable.on('end', () => {
    writable.write('\n');
    mergeStyles(styles, writable);
  });

  readable.on('error', error => {
    console.error(error);
    writable.end();
  });
}

bundle();