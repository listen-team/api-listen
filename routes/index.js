'use strict';

const express = require('express');
const api = express.Router();
const ctrlCategoria = require('.././controllers/categoria');
const ctrlUsuario = require('.././controllers/usuarios');

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
api.post('/usuario', ctrlUsuario.crearUsuario);

module.exports = api;