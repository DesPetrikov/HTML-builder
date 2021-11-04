const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function readStyles(){
	let writeStream = fs.createWriteStream(bundlePath);
	const dir = await fs.promises.readdir(stylesFolder, {withFileTypes: true});
	for await (let entry of dir){
		if(entry.isFile() && path.extname(entry.name) === '.css'){
			const readStream = new fs.ReadStream(path.join(__dirname, 'styles', entry.name), {encoding: 'utf-8'});
			readStream.on('readable', () => {
				let data;
				while((data = readStream.read()) !== null){
					writeStream.write(data)
				}
			});
			readStream.on('error', (err) => {
				console.error(err);
			})
		}	
	}
}
readStyles()