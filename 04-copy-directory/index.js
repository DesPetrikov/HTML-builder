const fs = require('fs');
const path = require('path');

const currentPath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

async function copyDir(currentPath, destinationPath) {
  try {
    await fs.promises.rm(destinationPath, { recursive: true, force: true });
    await fs.promises.mkdir(destinationPath);
    const dir = await fs.promises.readdir(currentPath, { withFileTypes: true });
    for await (let entry of dir) {
      if (entry.isFile()) {
        await fs.promises.copyFile(
          path.join(__dirname, 'files', entry.name),
          path.join(__dirname, 'files-copy', entry.name)
        );
      } else {
        await fs.promises.mkdir(path.join(__dirname, 'files-copy', entry.name));
        console.log('Deep copy is not supported');
      }
    }
    console.log('Files have been copied');
  } catch {
    console.log('Files could not be copied');
  }
}

copyDir(currentPath, destinationPath);
