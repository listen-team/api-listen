'use strict';

const app = require('./app');
const config = require('./config');
const server = require('./server/main')
const ctrlUsuario = require('./controllers/usuarios');



app.listen(config.port, () => {
//	console.log('<>'+ctrlUsuario.convertirTokenUsuario('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5ZWZyaW9zY2FyOTgxNEBnbWFpbC5jb20iLCJpYXQiOjE0OTkzNzU4NTMsImV4cCI6MTUwMDU4NTQ1M30.zl21HKpqV8XS0WnA5IFW56gTsfF1WAAESGdCJuWMpLk'));
	server.listen(3000,function(){
    	console.log("Servidor correndo en Http://localhost:3000");
	})	
	console.log(`API REST corriendo en http://localhost:${config.port}`);
});
