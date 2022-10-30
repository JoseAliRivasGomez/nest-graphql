<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar proyecto
2. __npm i__
3. Clonar el archivo __.env.template__ y renombrarlo a __.env__
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```
6. Levantar: 
```
npm run start:dev
```
7. Visitar sitio:
```
http://localhost:4000/graphql
```
8. Ejecutar la "mutation" __executeSeed__ para llenar la base de datos