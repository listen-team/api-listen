'use strict';

const firebase = require('firebase');

firebase.initializeApp({
	serviceAccount : '.././database/Listen-a11cf4bc17e5.json',
	databaseURL : 'https://listendb-ba317.firebaseio.com'
});

const db = firebase.database();

/*
* Retorna una categoria por su id
*/
function obtenerCategoria (req, res) {
	let idCategoria = req.params.id;
}

/*
* Retornas todas las categorias existentes
*/
function listarCategorias (req, res) {
	let categoria = db.ref('categoria');
	res.send(200, {categorias : []});
}

/*
* Crea una nueva categoria
*/
function crearCategoria (req, res) {
	let tipo = req.body.tipo;
	let categoria = db.ref('categoria');

	categoria.child('4').set({
	 	tipo: tipo
	});

	console.log(req.body.tipo);
	res.status(200).send({message : 'El producto ha sido recibido'});
}


/*
* Actualizar una categoria por su id
*/
function actualizarCategoria(req, res){

}

/*
* Elimina una categoria
*/
function eliminarCategoria (req, res) {
	let idCategoria = req.params.id;	
	console.log(idCategoria);
	let categoria = db.ref(`/categoria/${idCategoria}`).remove();
	res.status(200).send({message : 'La categoria ha sido eliminada'});
}

module.exports = {
	obtenerCategoria,
	listarCategorias,
	crearCategoria,
	actualizarCategoria,
	eliminarCategoria
}