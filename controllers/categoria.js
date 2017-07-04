'use strict';

const firebase = require('firebase');
const config = require('.././config');
const db = firebase.database();
const refCategoria = db.ref().child('categoria');
const objResponse = require('.././models/modelResponse');


/*
* Retorna una categoria por su id
*/
function obtenerCategoria (req, res) {
	let id = req.params.id;
	console.log(`Request >>> http://localhost:3002/api/categoria/${id}`);
	refCategoria.once('value', (snap) => {
		let lista = snap.val();
		let objCategoria = null;

		for(let key in lista){
			if (key === id) {
				objCategoria = {
					id : key,
					tipo : snap.val()[key].tipo
				};
				break;
			}
		}
		
		if (objCategoria !== null) {
			res.send(objResponse.modelResponse('', '', '', true, `Se obtubo la categoria ${objCategoria.tipo}`, 1, objCategoria))
		}else{
			res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'Categoria no encontrada', false, `No existe la categoria ${id}`, 0, 'error'))
		}
	});
}

/*
* Retornas todas las categorias existentes
*/
function listarCategorias (req, res) {
	console.log(`Request >>> http://localhost:3002/api/categoria`);
	refCategoria.once('value', (snap) => {
		let categorias = [];
		for(let key in snap.val()){
			let json = {
				id : key,
				tipo : snap.val()[key].tipo
			};
			categorias.push(json);
		}
		res.status(200).send(objResponse.modelResponse('', '', '', true, 'Lista de categorias', categorias.length, categorias));
	});
}

/*
* Crea una nueva categoria
*/
function crearCategoria (req, res) {
	console.log('Request >>> http://localhost:3002/api/categoria');
	let tipo = req.body.tipo === null || req.body.tipo === undefined ? '' : req.body.tipo;

	if (tipo !== '') {
		refCategoria.once('value', (snap) => {
			let existeCategoria = null;
			for(let key in snap.val()){
				if(snap.val()[key].tipo === tipo){
					existeCategoria = snap.val()[key];
					break;
				}
			}

			if(existeCategoria === null){
				let nuevaCategoria = refCategoria.push();
				let obj = {
					tipo
				};	

				nuevaCategoria.set(obj);
				res.send(objResponse.modelResponse('', '', '', true, 'Se registro la categoria', 1, 'ok'));	
			}else{
				res.send(objResponse.modelResponse('', 'EXISTS_CATEGORY', 'Categoria duplicada', false, 'La categoría ya existe', 0, 'error'));
			}
		});
	}else{
		res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'La categoria esta vacia', false, 'Debe de ingresar la categoria', 0, 'error'));	
	}
}


/*
* Actualizar una categoria por su id
*/
function actualizarCategoria(req, res){
	let idCategoria = req.params.id === null || req.params.id === undefined ? '' : req.params.id;
	console.log(`Request >>> http://localhost:3002/api/categoria/${idCategoria}`);

	if (idCategoria !== '') {
		///////////////////////////////////////////////////////////
		refCategoria.once('value', (snap) => {
			let lista = snap.val();
			let objCategoria = null;

			for(let key in lista){
				if (key === idCategoria) {
					objCategoria = {
						id : key,
						tipo : snap.val()[key].tipo
					};
					break;
				}
			}
			
			if (objCategoria !== null) {
				let refObjeto = refCategoria.child(''+req.params.id);
				let obj = {
					tipo : req.body.tipo === null || req.body.tipo === undefined ? '' : req.body.tipo
				};

				if(obj.tipo !== ''){
					refObjeto.update(obj);
					res.send(objResponse.modelResponse('', '', '', true, `Se actualizó la categoria ${obj.tipo}`, 1, 'ok'))
				}else{
					res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'Tipo de categoria vacía', false, `Ingresar el tipo de la categoria`, 0, 'error'))
				}
			}else{
				res.send(objResponse.modelResponse('', 'NOT_FOUND', 'Categoria no encontrada', false, `No existe la categoria ${idCategoria}`, 0, 'error'))
			}
		});
		///////////////////////////////////////////////////////////
	}else{
		res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'No ingreso categoria', false, "No ha ingresado la categoria", 0, 'error'));
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
					resolve(objResponse.modelResponse('', '', '', true, `La categoria ${id} ha sido eliminada`, 1, 'ok'));
				})
				.catch((error) => {
					reject(objResponse.modelResponse('', 'NOT_FOUND', 'Categoria no encontrada', false, `La categoria ${id} no existe`, 0, 'error'));
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