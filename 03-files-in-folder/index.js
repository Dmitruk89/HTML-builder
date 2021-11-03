const fs = require('fs/promises');
const path = require('path');

async function writeInfo(file) {
  const stat = await fs.stat(`./03-files-in-folder/secret-folder/${file}`);

  if (stat.isFile()) {
    const extention = path.extname(file).slice(1);
    const name = path.basename(file, extention).slice(0, -1);
    const statSize = stat.size / 1024;

    const info = `${name} - ${extention} - ${statSize} kb\n`;
    process.stdout.write(info);
  }
}

async function readDir() {
  const files = await fs.readdir('./03-files-in-folder/secret-folder');
  files.map(file => writeInfo(file));
}

readDir();