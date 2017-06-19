'use strict';

const express = require('express');
const api = express.Router();
const firebase = require('firebase');
const config = require('.././config');
const dbConfiguration = require('.././database/configDatabase');

firebase.initializeApp(dbConfiguration);


const ctrlCategoria = require('.././controllers/categoria');
const ctrlUsuario = require('.././controllers/usuarios.js');
const ctrlIdea = require('.././controllers/ideas');
const auth = require('.././middlewares/auth');

/*
* Modulo de categoria
*/
api.get('/categoria', ctrlCategoria.listarCategorias);
api.get('/categoria/:id', ctrlCategoria.obtenerCategoria);
api.post('/categoria', ctrlCategoria.crearCategoria);
api.put('/categoria/:id', ctrlCategoria.actualizarCategoria);
api.delete('/categoria/:id', ctrlCategoria.eliminarCategoria);

/*
* Modulo de usuario
*/
api.post('/user', ctrlUsuario.createUser);
api.post('/login', ctrlUsuario.loginWithFirebase);
api.post('/logout', ctrlUsuario.logoutWithFirebase);
api.post('/senResetPassword', ctrlUsuario.sendPasswordResetEmail);
api.get('/private',  auth ,(req, res) => {
	//res.writeHead(301, {Location : 'https://www.youtube.com/'});
	res.status(200).send({
		msg : 'Tienes acceso'
	});
	res.end();
});


/*
* Modulo de idea
*/
api.get('/idea', ctrlIdea.listarIdeas);
api.post('/idea', ctrlIdea.crearIdea);

module.exports = api;