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
api.get('/categoria', auth,ctrlCategoria.listarCategorias);
api.get('/categoria/:id', auth, ctrlCategoria.obtenerCategoria);
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
api.post('/verificarEmail', ctrlUsuario.verificacionEmail);
api.post('/loginWithGoogle', ctrlUsuario.loginWithGoogle);
api.get('/testing', auth ,(req, res) => {
	//res.writeHead(301, {Location : 'https://www.youtube.com/'});
	res.status(200).send({
		msg : `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`
	});
	//res.end();
});
api.post('/seguirusuario',auth, ctrlUsuario.seguidoresPorUsuario);
api.post('/seguirPersona', auth, ctrlUsuario.seguirPersona);
api.post('/seguirCategoria', auth, ctrlUsuario.seguirCategoria);
api.post('/seguirIdea', auth, ctrlUsuario.seguirIdea);
api.post('/darlike', ctrlUsuario.darLike);
api.post('/contribuirIdea', auth, ctrlUsuario.contribuirIdea);
api.post('/obtenerUsuarioxToken', auth, ctrlUsuario.obtenerUsuarioPorToken);
api.post('/actualizarUsuario', auth, ctrlUsuario.actualizarUsuario);


/*
* Modulo de idea
*/
api.get('/idea', auth, ctrlIdea.listarIdeas);
api.post('/idea', auth, ctrlIdea.crearIdea);
api.get('/ideasxusuario', auth, ctrlIdea.ideasPorCategoriaDelUsuario)
api.get('/contribuidoresIdea/:id', ctrlIdea.listaDeContribuidoresPorIdea);

module.exports = api;