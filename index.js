'use strict';
const express = require('express');
const bodyParse = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParse.urlencoded({extended : false}));
app.use(bodyParse.json());

app.get('/:name', (req, res) => {
	res.send({message : `Hola ${req.params.name}`});
});

app.listen(port, () => {
	console.log(`API REST corriendo en http://localhost:${port}`);
});
