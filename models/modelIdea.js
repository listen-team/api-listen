'use strict';

class Usuario{
	constructor(dni, nombre, apellido, fechaNacimiento, genero, correo, contrasena, tipoUsuario, firma){
		this.dni = dni;
		this.nombre = nombre;
		this.apellido = apellido;
		this.fechaNacimiento = fechaNacimiento;
		this.genero = genero;
		this.correo = correo;
		this.contrasena = contrasena;
		this.tipoUsuario = tipoUsuario;
		this.firma = firma;
	}

	nombreCompleto(){
		return `${this.dni} ${this.apellido}`;
	}

}
