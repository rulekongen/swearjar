'use strict';
const fs = require('fs');
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.post('/addpoint', (request, response) => {
	let swears = getSwears();
	for (var i = 0; i < swears.length; i++) {
		if(request.body.name === swears[i].name) {
			swears[i].entries.push({"Word": request.body.word, "Snitch": request.body.username, "Timestamp" : new Date()});
		}
	}
  setSwears(swears);
  response.send("Success")
});

app.post('/removepoint', (request, response) => {
	let swears = getSwears();
  	for (var i = 0; i < swears.length; i++) {
  		if(request.body.name === swears[i].name && swears[i].entries.length > 0) {
        swears[i].entries.pop()
  		}
	}
  setSwears(swears);
  response.send("Success")
});

app.post('/addperson', (request, response) => {
  let swears = getSwears();
  for(var i = 0; i < swears.length; i++) {
    if(request.body.name === swears[i].name) {
      return
    }
  }
  swears.push({name: request.body.name, entries: []});
  setSwears(swears);
  response.send("Success")
});

app.get('/getswears', (request, response) => {
  let swears = getSwears();
  response.send(swears);
});

app.post('/removeperson', (request, response) => {
  let swears = getSwears();
  for(var i = 0; i < swears.length; i++) {
    if(request.body.name === swears[i].name) {
      swears.splice(i,1);
    }
  }
  setSwears(swears);
  response.send("Success")
});

app.get('/admin', (request, response) => {
  response.render('admin', {data: getSwears()})
})

app.get('/', (request, response) => {
  let vData = getSwears();
	response.render('home', {rawdata: vData, data: JSON.stringify(vData)});
});

function getSwears()
{
  if (fs.existsSync('swearstats.json')) {
    let rawdata = fs.readFileSync('swearstats.json');
  	let data = JSON.parse(rawdata);
    if(data) return data;
  }

  return [];

}

function setSwears(pData) {
  let data = JSON.stringify(pData);
	fs.writeFile('swearstats.json', data, (err) => {
		if (err) throw err;
	});
}

var port = process.env.PORT || 1337;
app.listen(port);
