'use strict';

const firebase = require('firebase');
const config = require('.././config');
const db = firebase.database();
const refIdea = db.ref().child('idea');


/*
* Metodo para listar ideas
*/
function listarIdeas (req, res) {
	let data;
	refIdea.on('value', (snap) => {
		data = snap.val();
		console.log(snap.val());
	});
	res.status(200).send(data);
}

/*
* Metodo para crear ideas
*/
function crearIdea (req, res) {
	let nuevaIdea = refIdea.child(''+req.body.numero);

	
	let objIdea = {
		numero : req.body.numero,
		beneficios:  req. body.beneficios,
		descripcion : req.body.descripcion,
		disposicionesFinales : req.body.disposicionesFinales,
		efectos : req.body.efectos,
		fechaActualizacion : req.body.fechaActualizacion,
		fechaElaboracion : req.body.fechaElaboracion,
		formulaLegal : req.body.formulaLegal,
		motivos : req.body.motivos,
		titular : req.body.titular,
		categoria : req.body.categoria
	};

	nuevaIdea.set(objIdea);
	
	res.status(200).send({msg : 'Se registro la idea'});	
}

module.exports = {
	listarIdeas,
	crearIdea
};
