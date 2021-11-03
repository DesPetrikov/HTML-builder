const fs = require('fs');
const path = require('path');
const text = path.join(__dirname, 'text.txt')
const stream = new fs.ReadStream(text, {encoding: 'utf-8'});


stream.on('readable', () => {
	let data;
	while((data = stream.read()) !== null){
		console.log(data);
	}
});

stream.on('error', (err) => {
	if(err.code == 'ENOENT'){
		console.log(`В директории ${path.dirname(__filename)} не найден файл ${path.basename(text)}`);
	} 
	else{
		console.error(err.message);
	}
})