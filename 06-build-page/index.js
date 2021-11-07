const fsProm = require('fs/promises');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist');

const cssFilesPath = path.join(__dirname, 'styles');
const cssBundlePath = path.join(__dirname, 'project-dist', 'style.css');

const htmlFilePath = path.join(__dirname, 'template.html');
const htmlBundlePath = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');

const assetsPath = path.join(__dirname, 'assets');
const assetsBundlePath = path.join(__dirname, 'project-dist', 'assets');

async function cleanBundleDir(bundlePath) {
  const content = await fsProm.readdir(bundlePath);
  
  content.map(async file => {
    const filePath = path.join(bundlePath, file);
    const fileStat = await fsProm.stat(filePath);
    if (fileStat.isDirectory()) await cleanBundleDir(filePath);
    else await fsProm.rm(filePath);
  });
}

async function createBundleDir() {
  await fsProm.mkdir(bundlePath, {recursive: true});
}

async function bundleHTML() {
  const template = await fsProm.readFile(htmlFilePath, 'utf8');
  const components = template.match(/(?<={{)[^}]*(?=}})/g);
  const componentsMarkup = await Promise.all(
    components.map((component) =>
      fsProm.readFile(path.join(componentsPath, `${component}.html`))
    )
  );
  const markup = components.reduce(
    (bundle, component, index) =>
      bundle.replace(`{{${component}}}`, componentsMarkup[index]),
    template
  );
  fsProm.writeFile(htmlBundlePath, markup);
}

async function bundleCSS() {
  const dirContent = await fsProm.readdir(cssFilesPath);
  const cssFiles = dirContent.filter(file => path.extname(file) === '.css');
  const data = await Promise.all(
    cssFiles.map(name => fsProm.readFile(path.join(cssFilesPath, name), 'utf8'))
  );
  fsProm.writeFile(cssBundlePath, data.join('\n'));
}

async function copyAssets(bundlePath, sourcePath) {
  await fsProm.mkdir(bundlePath, {recursive: true});
  const assetsContent = await fsProm.readdir(sourcePath);
  assetsContent.map(async asset => {
    const originPath = path.join(sourcePath, asset);
    const copyPath = path.join(bundlePath, asset);
    const dirStat = await fsProm.stat(originPath);
    if (dirStat.isDirectory()) copyAssets(copyPath, originPath);
    else await fsProm.copyFile(originPath, copyPath);
  });
}

async function buildHTML() {
  await createBundleDir();
  await cleanBundleDir(bundlePath);
  bundleHTML();
  bundleCSS();
  copyAssets(assetsBundlePath, assetsPath);
}

buildHTML();