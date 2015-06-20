# Unify

####Unify es una aplicación que permite a personas alejadas de la tecnología interactuar con el contenido de sus amigos en las redes sociales de una forma rápida y sencilla.

## Instalación del ambiente de desarrollo para la API

1. Instalar [Git](https://git-scm.com/downloads).
2. Instalar [Node JS](https://nodejs.org/).
3. Instalar [Mongo DB](https://www.mongodb.org/downloads) y crear la carpeta `/data/db` (ver las instrucciones para [Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/) y para [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)).
4. Clonar el **repositorio** de unify-api ejecutando `git clone https://<user>@bitbucket.org/unifyargentina/unify-api.git` 
5. Dirigirse al directorio `unify-api` e instalar los módulos ejecutando `npm install`.
6. Levantar **Mongo DB** (ver las instrucciones para [Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/#start-mongodb) y para [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb)).
7. Levantar la **API** ejecutando `node app.js`, o si quieren que en cada cambio que le hagan a la API se vuelva a levantar automáticamente, deberán instalar [Nodemon](http://nodemon.io).
8. La **API** debería estar levantada en la ruta [`http://localhost:8080`](http://localhost:8080).

##Testing

Se utilizará como herramienta para realizar tests unitarios de los servicios de la API [Mocha](http://mochajs.org/):
1. Instalarlo ejecutando `sudo npm install -g mocha` (en Windows no es necesario el sudo).
2. Sobre el directorio principal de la API, levantar Mongo DB, levantar la API, y ejecutar `mocha` desde la terminal. Deberían aparecer los resultados de todos los tests.

##Documentar los servicios

Se utilizará como herramienta para la documentación de la API [apiDoc](http://apidocjs.com/). Es una herramienta **open source** que permite de una forma muy fácil documentar los distintos servicios que ofrece la API, los parámetros que recibe y los parámetros que devuelve:
1. Instalarla ejecutando `sudo npm install -g apidoc`.
2. Sobre el directorio principal de la API, ejecutar `apidoc -i auth/ -o doc/` para documentar en el directorio `doc/` los servicios que se encuentren en el directorio `auth/`. Lo mismo si queremos documentar en el directorio `doc/` los servicios que se encuentren en el directorio `api/`, deberemos ejecutar `apidoc -i auth/ -o doc/`.