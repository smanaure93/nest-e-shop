<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Requisitos

1. [Docker Desktop](https://www.docker.com/get-started)
2. [Node](https://nodejs.org/es/)

# Ejecutar en desarrollo

1. Clonar repositorio
2. Abrir terminal como administrador
3. Instalar Nest CLI
   ```
   npm i -g @nestjs/cli
   ```
4. Instalar dependencias
   ```
   yarn install
   ```
5. Generar archivo `.env` a partir de `.env.template`

6. Instalar imagen de PostgreSQL

   ```
   docker pull postgres:14.3
   ```

7. Levantar contenedores en ambiente de desarrollo

   ```
    docker-compose up -d
   ```

8. Poblar base de datos para desarrollo, consultando el endpoint: `/api/v2/seed`
