'use strict';
const firebase = require('firebase');
const db = firebase.database();
const refIdea = db.ref().child('idea');

/**
 * Modelo idea
 * Funcion para crear la estructura de una idea.
 * @param {number} num - Numero de la idea
 * @param {string} ben - Beneficios de la idea
 * @param {string} des - Descripcion de la idea
 * @param {string} dis - Disposiciones finales de la idea
 * @param {string} efe - Efectos de la idea
 * @param {string} fac - Fecha de actualización de la idea
 * @param {string} fel - Fecha de elaboración de la idea
 * @param {string} form - Formula legal de la idea
 * @param {string} mot - Motivos de la idea
 * @param {string} tit - Id del titular de la idea
 * @param {string} cat - Id de la categoria de la idea
 * @returns {json} Retorna el modelo de la idea en formato JSON
 */
function modelIdea(num, ben, des, dis, efe, fac, fel, form, mot, tit, cat) {
    let objectJSON = {
        numero : num,
        beneficios : ben,
        descripcion : des,
        disposicionesFinales : dis,
        efectos : efe,
        fechaActualizacion : fac,
        fechaElaboracion : fel,
        formulaLegal : form,
        motivos : mot,
        titular : tit,
        categoria : cat
    };
    return objectJSON;
}

/**
 * Lista de ideas
 * @returns Retorna un array de json con todas las ideas encontradas
 */
function listaDeIdeas() {
    let data = [];
	refIdea.on('value', (snap) => {
        for(let key in snap.val()){
            data.push(snap.val()[key]);
        }
	});
    return data;
}

module.exports = {
    modelIdea,
    listaDeIdeas
}