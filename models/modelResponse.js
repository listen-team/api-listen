'use strict';

/**
 * Modelo respuesta
 * Funcion para crear la estructura de una respuesta.
 * @param {string} token - Token de autenticación
 * @param {string} errorCode - Codigo del error generado por firebase
 * @param {string} errorMessage - Mensaje de error generado por firebase
 * @param {boolean} success - True si se ejecuto bien | False se hubo error al ejecutar
 * @param {string} msg - Mensaje de la ejecucion
 * @param {number} cant - Cantidad de registros afectados
 * @param {json | json[]} data - Objeto JSON o array de objetos JSON
 * @returns {json} Retorna un objeto json con informacion relevante del estado de la ejecucion
 */
function modelResponse(token, errorCode, errorMessage, success, msg, cant, data) {
	let objJSON = {
		token : token, 
		error : {
			errorCode : errorCode,
			errorMessage : errorMessage
		},
		success : success,
		message : msg,
		count : cant,
		data : data
	};

	return objJSON;
}

module.exports = {
    modelResponse
}