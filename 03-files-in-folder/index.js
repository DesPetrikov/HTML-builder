const fs = require('fs');
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder')

async function readDirectory(secretFolder){
	const dir = await fs.promises.readdir(secretFolder, {withFileTypes: true})
	for await (let entry of dir){
		if(entry.isFile()){
			const name = entry.name;
			const fileExtension = path.extname(name);
			const fileName = path.basename(path.join(secretFolder, name), fileExtension);
			const stats = await fs.promises.stat(path.join(secretFolder, name));
			const fileSize = `${stats.size / 1024}kb`;
			console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSize}`);
		}
	}
}
readDirectory(secretPath)