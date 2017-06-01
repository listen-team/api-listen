'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');

const app = express();
const port = process.env.PORT || 3001;

firebase.initializeApp({
	serviceAccount : './database/Listen-1407cf5d699d.json',
	databaseURL : 'https://listendb-ba317.firebaseio.com'
});

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/categoria', (req, res) => {
	res.send(200, {categorias : []});
});


// para acceder a un unico recurso
app.get('/categoria/:id', (req, res) => {

});

// crear categoria
app.post('/categoria', (req, res) => {
	let tipo = req.body.tipo;
		const db = firebase.database();
		let categoria = db.ref('categoria');

		categoria.child('4').set({
	 	tipo: tipo
	});

	console.log(req.body.tipo);
	res.status(200).send({message : 'El producto ha sido recibido'});
});

// actualizar categoria
app.put('/categoria/:id', (req, res) => {

});

// eliminar categoria
app.delete('/categoria/:id', (req, res) => {

});



app.listen(port, () => {
	console.log(`API REST corriendo en http://localhost:${port}`);
});
