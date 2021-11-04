
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const originDirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.access(copyDirPath, fs.constants.W_OK);
    const copyDirFiles = await fsPromises.readdir(copyDirPath);
    copyDirFiles.forEach(file => {
      const filePath = path.join(copyDirPath, file);
      fsPromises.unlink(filePath);
    });
  } catch {
    await fsPromises.mkdir(copyDirPath, { recursive: true });
  }

  const files = await fsPromises.readdir(originDirPath);
  files.forEach(async (file) => {
    const originFilePath = path.join(__dirname, 'files', file);
    const copyFilePath = path.join(__dirname, 'files-copy', file);
    await fsPromises.copyFile(originFilePath, copyFilePath);
  });
}

copyDir();