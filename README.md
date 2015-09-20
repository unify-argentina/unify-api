# Unify

####Unify es una aplicación que permite a personas alejadas de la tecnología interactuar con el contenido de sus amigos en las redes sociales de una forma rápida y sencilla.

## Instalación del ambiente de desarrollo para la API

1. Instalar [Git](https://git-scm.com/downloads).
2. Instalar [Node JS](https://nodejs.org/).
3. Instalar [Mongo DB](https://www.mongodb.org/downloads) y crear la carpeta `/data/db` (ver las instrucciones para [Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/) y para [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)).
4. Clonar el **repositorio** de unify-api ejecutando `git clone https://<user>@bitbucket.org/unifyargentina/unify-api.git` 
5. Dirigirse al directorio `unify-api` e instalar los módulos ejecutando `npm install`.
6. Levantar **Mongo DB** (ver las instrucciones para [Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/#start-mongodb) y para [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb)).
7. Copiarse el start.sh.example y renombrarlo a start.sh, poniendo las claves correctas para cada servicio.
8. Levantar la **API** ejecutando el script start.sh, o si quieren que en cada cambio que le hagan a la API se vuelva a levantar automáticamente, deberán instalar [Nodemon](http://nodemon.io) y en el script.sh al final reemplazar `node app.js` por `nodemon app.js`.
9. La **API** debería estar levantada en la ruta [`http://localhost:8080`](http://localhost:8080).

##Heroku

Para configurar la aplicación para que se puedan probar los cambios en Heroku, seguir los siguientes pasos:

1. Instalar [Heroku Toolbet](https://toolbelt.heroku.com/).
2.	Ejecutar `heroku login` e ingresar con la cuenta de unify de heroku: `unify.argentina@gmail.com`.
3.	Una vez que hayamos hecho login, sobre el directorio de `unify-api/` ejecutar el siguiente comando: `heroku git:remote -a api-unify`. 
4.	Verificar que efectivamente se haya agregado el remote de heroku a la configuración del repositorio de git. Para esto, abrir el archivo `.git/config`, y ver que al final se encuentre esto:
`[remote "heroku"]
	url = https://git.heroku.com/api-unify.git
	fetch = +refs/heads/*:refs/remotes/heroku/*`

Si se quiere hacer algún cambio y probarlo en **Heroku**, seguir estos pasos:

1. Hacer algún cambio y hacer un commit. Una vez probado localmente ese cambio y su **correcto funcionamiento**, hacer un `git push heroku master`. 
2. Cuando termine de compilar los cambios, ingresar a [`api-unify.herokuapp.com/api`](http://api-unify.herokuapp.com/api) y verificar que esté levantada y funcionando correctamente.

##Desarrollo

Siempre que se haga un nuevo cambio:

1. Probar que funcione correctamente en el entorno de desarrollo local.
2. Hacer los tests correspondientes para validar dicha funcionalidad.
3. Para commitear, si el issue se llama _#1: Autenticación con Facebook_, el commit será `git commit -m "#1: Autenticación con Facebook"`. 
4. Por último, hacer un `git push` y luego un `git push heroku master` para subir el cambio también a **Heroku**.

##Testing

Se utilizará como herramienta para realizar tests unitarios de los servicios de la API [Mocha](http://mochajs.org/):

1. Instalarlo ejecutando `sudo npm install -g mocha` (en Windows no es necesario el sudo).
2. Sobre el directorio principal de la API, levantar Mongo DB, levantar la API, y ejecutar `mocha` desde la terminal. Deberían aparecer los resultados de todos los tests.

##Documentar los servicios

Se utilizará como herramienta para la documentación de la API [apiDoc](http://apidocjs.com/). Es una herramienta **open source** que permite de una forma muy fácil documentar los distintos servicios que ofrece la API, los parámetros que recibe y los parámetros que devuelve:

1. Instalarla ejecutando `sudo npm install -g apidoc`.
2. Sobre el directorio principal de la API, ejecutar `apidoc -i api/ -o doc/` para documentar en el directorio `doc/` los servicios que se encuentren en el directorio `api/`. 