### Comando para encriptar contraseñas
```
npm i -S bcrypt-nodejs
```

### Importar bcrypt
```
const bcrypt = require('bcrypt-nodejs')
```

### Instalar jwt-simple
```
npm i --save jwt-simple
```

### Instalar moment
```
npm i -S moment
```

### Obtener la cantidad de hijos
```
refCategoria.once('value').then((snap) => {
		let key = snap.numChildren();
		console.log(key);
});
```




	refCategoria.on('value', (snap) => {
		let objCategoria = snap.child(id).val();
		let clave;
		let strCategoria = '';
		let cantClaves = snap.child(id).numChildren();
		
		for (let i = 0; i < cantClaves; i++) {
			clave = Object.keys(objCategoria)[i];

			if(i === 0){
				strCategoria += '{';
			}

			if (i === (cantClaves - 1)) {
				strCategoria += clave + ": "+ snap.child(id).child(clave).val();
			}else {
				strCategoria += clave + ': ' + snap.child(id).child(clave).val() + ',';
			}

			if(i === (cantClaves - 1)){
				strCategoria += '}';
			}
			console.log(strCategoria);
		}

		


		if (objCategoria != null) {
			res.status(200).send(objCategoria);
		}else{
			res.status(404).send({msg : "No existe la categoria"});
		}
		
	});


###### a
			let clave;
			let strCategoria = '';
			let cantClaves = snap.child(id).numChildren();
			
			for (let i = 0; i < cantClaves; i++) {
				clave = Object.keys(objCategoria)[i];

				if(i === 0){
					//strCategoria += "{\"id\"" + " : \""+id+"\",";
					strCategoria += '{';
				}

				if(i === (cantClaves - 1)){
					strCategoria += "\"" + clave + "\"" + " : \"" + snap.child(id).child(clave).val() + "\"}";
				}else {
					strCategoria += "\"" + clave + "\"" + " : \"" + snap.child(id).child(clave).val() + "\",";
					//strCategoria += clave + ': ' + snap.child(id).child(clave).val() + ',';
				}

				
			}

			let jsonCategoria = JSON.parse(strCategoria);