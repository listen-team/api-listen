'use strict';

const firebase = require('firebase');
const config = require('.././config');
const db = firebase.database();
const refIdea = db.ref().child('idea');
const refUser = db.ref().child('usuario');
const idea = require('.././models/modelIdea');
const modelIdea = require('.././models/modelResponse');
const refUsuarioCategoria = db.ref().child('usuarioxcategoria');


/**
 * Metodo para listar ideas
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function listarIdeas (req, res) {
	let data = idea.listaDeIdeas();
	res.status(200).send(modelIdea.modelResponse(
			null,
			null,
			null,
			true, 
			`Se listaron las ideas`, 
			data.length, 
			data)
	);
}

/**
 * Metodo para crear una idea
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function crearIdea (req, res) {
	let nuevaIdea = refIdea.push();
	let key = nuevaIdea.toString().split('/idea/')[1];
	let num = req.body.numero;
	let ben = req. body.beneficios;
	let des = req.body.descripcion;
	let dis = req.body.disposicionesFinales;
	let efe = req.body.efectos;
	let fac = req.body.fechaActualizacion;
	let fel = req.body.fechaElaboracion;
	let form = req.body.formulaLegal;
	let mot = req.body.motivos;
	let tit = req.body.titular;
	let cat = req.body.categoria;

	nuevaIdea.set(idea.modelIdea(num, ben, des, dis, efe, fac, fel, form, mot, tit, cat));
	
	res.status(200).send(
		modelIdea.modelResponse(
			null,
			null,
			null, 
			true, 
			`Se registro la idea ${key}`, 
			1, 
			idea.modelIdea(num, ben, des, dis, efe, fac, fel, form, mot, tit, cat))
	);	
}

function ideasPorCategoriaDelUsuario(req, res) {
	let email = req.user;
	let token = req.token;

	refUsuarioCategoria.on('value', (snap) => {
		let lista = snap.val();
		let user = null;

		for(let key in lista){
			console.log(lista[key].correo + ' < > '+ email);
			if (lista[key].correo == email) {
				user = lista[key];
				console.log(user);
				break;
			}
		}

		if(user != null){
			refIdea.on('value', (snap) => {
				let listaIdea = snap.val();
				let ideasDelUsuario = [];
				let contador = 0;

				for(let key in listaIdea){
					contador++
					if (listaIdea[key].categoria == user.categoria) {
						ideasDelUsuario.push(listaIdea[key]);	
						console.log(user + ' <> ' + contador);
					}
				}		

				res.status(200).send(modelIdea.modelResponse(token, null, null, true, 'Se listaron las ideas del usuario', ideasDelUsuario.length, ideasDelUsuario));

			});
		}else{
			res.status(404).send(modelIdea.modelResponse(token,null,null,false, 'El usuario no existe', 0, email));
		}
	});
}

function ideasSeguidas(req, res){

}


module.exports = {
	listarIdeas,
	crearIdea,
	ideasPorCategoriaDelUsuario
};

