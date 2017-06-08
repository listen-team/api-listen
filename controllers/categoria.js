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
	let data;
	refCategoria.on('value', (snap) => {
		data = snap.val();
		console.log(snap.val());
	});
		res.status(200).send(data);


/*	let promise = new Promise((resolve, reject) => {
		let data;

		refCategoria.on('value', (snap) => {
			data = snap.val();
		});

		refCategoria.on('child_changed', (snap) => {
			data = snap.val();
		});
	
		resolve(data);
	});

	promise.then((response) => {
		console.log(response);
		res.status(200).send(response);
	}, (error) => {
		console.log(error);
		res.status(404).send(error);
	});	*/
}

/*
* Crea una nueva categoria
*/
function crearCategoria (req, res) {
	let nuevaCategoria = refCategoria.child(''+req.body.numero);
	let obj = {
		numero : req.body.numero,
		tipo : req.body.tipo
	};

	nuevaCategoria.set(obj);
	
	res.status(200).send({msg : 'Se registro el producto'});	
}


/*
* Actualizar una categoria por su id
*/
function actualizarCategoria(req, res){
	let refObjeto = refCategoria.child(''+req.params.id);
	let obj = {
		numero : req.body.numero,
		tipo : req.body.tipo
	};

	refObjeto.update(obj);

	if (refObjeto != null) {
		res.status(200).send({msg : 'Categoria actualizada'});
	}else{
		res.status(404).send({msg : "No existe la categoria"});
	}
}

/*
* Elimina una categoria
*/
function eliminarCategoria (req, res) {
	let id = req.params.id;
	
	let promise = new Promise((resolve, reject) => {
		refCategoria.on('value', (snap) => {
			
			let objCategoria = refCategoria.child(id);

			objCategoria.remove()
				.then(() =>{
					resolve({msg : 'La categoria ha sido eliminada'});
				})
				.catch((error) => {
					reject({msg : 'No existe la categoria'});
				});
		});	
	});


	promise.then((response) => {
		res.status(200).send(response);
	}, (error) => {
		res.status(404).send(error);
	});	
}

module.exports = {
	obtenerCategoria,
	listarCategorias,
	crearCategoria,
	actualizarCategoria,
	eliminarCategoria
};