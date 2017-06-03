'use strict';

const firebase = require('firebase');
const config = require('.././config');

// conecta a la base de datos de firebase
firebase.initializeApp({
	serviceAccount : '.././database/Listen-a11cf4bc17e5.json',
	databaseURL : config.url
});

// 
const db = firebase.database();
const refCategoria = db.ref().child('categoria');


/*
* Retorna una categoria por su id
*/
function obtenerCategoria (req, res) {
	let id = req.params.id;

	refCategoria.on('value', (snap) => {
		let lista = snap.val();
		let objCategoria;

		for(let key in lista){
			if (lista[key].numero == id) {
				 objCategoria = snap.child(key).val();
				 break;
			}
		}
		
		if (objCategoria != null) {
			res.status(200).send(objCategoria);
		}else{
			res.status(404).send({msg : "No existe la categoria"});
		}
	});
}

/*
* Retornas todas las categorias existentes
*/
function listarCategorias (req, res) {
	refCategoria.once('value').then((snap) => {
		
		let data = snap.val();
		res.status(200).send(data);
	});
}

/*
* Crea una nueva categoria
*/
function crearCategoria (req, res) {
	let nuevaCategoria = refCategoria.push();
	nuevaCategoria.set({
		numero : req.body.numero,
		tipo : req.body.tipo
	});
	
	res.status(200).send({msg : 'Se registro el producto'});	
	//refCategoria.push(nuevaCategoria);

}


/*
* Actualizar una categoria por su id
*/
function actualizarCategoria(req, res){
	let numero = req.params.id;
	let tipo = req.body.tipo;

	refCategoria.once('value', (snap) => {
		let lista = snap.val();
		let objCategoria;
		let item;

		for(let key in lista){
			if (lista[key].numero == numero) {
				 item = key;
				 objCategoria = snap.child(key).val();
				 break;
			}
		}
		
		if (objCategoria != null) {
			let actCategoria = refCategoria.child(item).update({
				numero : numero,
				tipo : tipo
			});
			res.status(200).send({msg : 'Categoria actualizada'});
		}else{
			res.status(404).send({msg : "No existe la categoria"});
		}
	});
}

/*
* Elimina una categoria
*/
function eliminarCategoria (req, res) {
	let id = req.params.id;
	
	let promise = new Promise((resolve, reject) => {
		refCategoria.on('value', (snap) => {
			let lista = snap.val();
			let objCategoria;
			let item;

			for(let key in lista){
				if (lista[key].numero == id) {
					 item = key;
					 console.log(item);
					 objCategoria = snap.child(key).val();
					 break;
				}
			}
			
			if (objCategoria != null) {
				refCategoria.child(item).remove();
				resolve({msg : 'La categoria ha sido eliminada'});
			}else{
				reject({msg : 'No existe la categoria'});
			}
		});	
	});


	promise.then((response) => {
		console.log(response);
		res.status(200).send(response);
	}, (error) => {
		console.log(error);
		res.status(404).send(error);
	});	
}

module.exports = {
	obtenerCategoria,
	listarCategorias,
	crearCategoria,
	actualizarCategoria,
	eliminarCategoria
}