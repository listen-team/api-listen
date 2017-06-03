'use strict';

const express = require('express');
const api = express.Router();
const categoriaController = require('.././controllers/categoria');

/*
* Modulo de categoria
*/
api.get('/categoria', categoriaController.listarCategorias);
api.get('/categoria/:id', categoriaController.obtenerCategoria);
api.post('/categoria', categoriaController.crearCategoria);
api.put('/categoria/:id', categoriaController.actualizarCategoria);
api.delete('/categoria/:id', categoriaController.eliminarCategoria);


module.exports = api;