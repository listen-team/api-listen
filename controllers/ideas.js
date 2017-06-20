'use strict';

const firebase = require('firebase');
const config = require('.././config');
const db = firebase.database();
const refIdea = db.ref().child('idea');
const idea = require('.././models/modelIdea');
const objResponse = require('.././models/modelResponse');


/**
 * Metodo para listar ideas
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function listarIdeas (req, res) {
	let data = idea.listaDeIdeas();
	res.status(200).send(objResponse.modelResponse(
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
		objResponse.modelResponse(
			null,
			null,
			null, 
			true, 
			`Se registro la idea ${key}`, 
			1, 
			idea.modelIdea(num, ben, des, dis, efe, fac, fel, form, mot, tit, cat))
	);	
}

function ideasPorCategoria(req, res) {
	let data = idea.listaDeIdeas();

	


}

function ideasSeguidas(req, res){

}


module.exports = {
	listarIdeas,
	crearIdea
};
