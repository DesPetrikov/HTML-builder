const fs = require('fs');
const path = require('path');
const { resolve } = require('path/posix');

const bundlePath = path.join(__dirname, 'project-dist');
const bundleHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
const bundleCssPath = path.join(__dirname, 'project-dist', 'style.css');
const stylesFolder = path.join(__dirname, 'styles');
const componentshPath = path.join(__dirname, 'components');

const currentPathFonts = path.join(__dirname, 'assets', 'fonts');
const destinationPathFonts = path.join(
  __dirname,
  'project-dist',
  'assets',
  'fonts'
);

const currentPathImg = path.join(__dirname, 'assets', 'img');
const destinationPathImg = path.join(
  __dirname,
  'project-dist',
  'assets',
  'img'
);

const currentPathSvg = path.join(__dirname, 'assets', 'svg');
const destinationPathSvg = path.join(
  __dirname,
  'project-dist',
  'assets',
  'svg'
);

async function readHtml() {
  await fs.promises.mkdir(bundlePath, { recursive: true });
  const writeBundleStream = fs.createWriteStream(bundleHtmlPath);
  const readTemplateStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    { encoding: 'utf-8' }
  );
  let bundleData = '';
  const bundlePromise = () =>
    new Promise((resolve) => {
      readTemplateStream.on('data', (chunk) => {
        bundleData += chunk;
        resolve(bundleData);
      });
    });
  await bundlePromise();

  const dir = await fs.promises.readdir(componentshPath, {
    withFileTypes: true,
  });
  for await (let entry of dir) {
    if (entry.isFile() && path.extname(entry.name) === '.html') {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'components', entry.name),
        { encoding: 'utf-8' }
      );

      const newPromise = () =>
        new Promise((resolve) => {
          readStream.on('data', (chunk) => {
            let data = '';
            data += chunk;
            const regExp = new RegExp(
              '{{' +
                path.basename(
                  path.join(__dirname, 'components', entry.name),
                  path.extname(entry.name)
                ) +
                '}}'
            );
            bundleData = bundleData.replace(regExp, data);
            resolve(bundleData);
          });
        });
      await newPromise();
    }
  }
  writeBundleStream.write(bundleData);
}
readHtml();

async function readStyles() {
  const writeStream = fs.createWriteStream(bundleCssPath);
  const dir = await fs.promises.readdir(stylesFolder, { withFileTypes: true });
  [dir[dir.length - 3], dir[dir.length - 1]] = [
    dir[dir.length - 1],
    dir[dir.length - 3],
  ];
  for await (let entry of dir) {
    if (entry.isFile() && path.extname(entry.name) === '.css') {
      const readStream = new fs.ReadStream(
        path.join(__dirname, 'styles', entry.name),
        { encoding: 'utf-8' }
      );
      readStream.on('readable', () => {
        let data;
        while ((data = readStream.read()) !== null) {
          writeStream.write(data);
        }
      });
      readStream.on('error', (err) => {
        console.error(err.message);
      });
    }
  }
}
readStyles();

const fonts = 'fonts';
const img = 'img';
const svg = 'svg';

async function copyDir(currentPath, destinationPath, folderType) {
  try {
    await fs.promises.rm(destinationPath, { recursive: true, force: true });
    await fs.promises.mkdir(destinationPath, { recursive: true, force: true });
    const dir = await fs.promises.readdir(currentPath, { withFileTypes: true });
    for await (let entry of dir) {
      if (entry.isFile()) {
        await fs.promises.copyFile(
          path.join(__dirname, 'assets', folderType, entry.name),
          path.join(__dirname, 'project-dist', 'assets', folderType, entry.name)
        );
      }
    }
  } catch {
    console.log('Files could not be copied');
  }
}

copyDir(currentPathFonts, destinationPathFonts, fonts);
copyDir(currentPathImg, destinationPathImg, img);
copyDir(currentPathSvg, destinationPathSvg, svg);
