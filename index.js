'use strict';
const fs = require('fs');
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.post('/poeng', (request, response) => {
	let banning = hentBanning();
	for (var i = 0; i < banning.length; i++) {
		if(request.query.Navn === banning[i].name) {
			banning[i].antall++;
		}
	}
	let data = JSON.stringify(banning);
	fs.writeFile('swearstats.json', data, (err) => {  
		if (err) throw err;
		console.log('Data written to file');
	});
});

app.get('/', (request, response) => {
	response.render('home', {data: hentBanning()})
});

function hentBanning()
{
	let rawdata = fs.readFileSync('swearstats.json');  
	let data = JSON.parse(rawdata);  
	return data;
}

app.listen(3000);