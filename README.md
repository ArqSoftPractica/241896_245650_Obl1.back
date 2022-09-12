# ASP-Secinaro-RodriguezSotto

Obl 1 ASP BACKEND

## Instrucciones para levantar el proyecto

### Produccion

#### Simular build de produccion mediante docker

```bash
docker create volume aspback

# Mediante yarn
yarn drb

# Mediante docker puro
docker build -t \"aspback\" . -f ./docker/Dockerfile
docker run -d -p 80:80 --name aspback -v \"aspback:/var/log\" --env-file ./env
```

### Desarrollo

#### Local

```bash
yarn # El equipo utilizo yarn pero es posible tambien utilizar 'npm install'

yarn dev # npm run dev
```

#### Docker

```bash
yarn d:dev # Lanzar el contenedor de desarrollo mediante el script de npm

docker-compose -f docker/docker-compose.yaml up # Lanzar el contenedor de desarrollo mediante docker-compose directo
```

#### Base de Datos

Para correr las migraciones utilizar el siguiente comando:

```bash
npx prisma migrate dev
```

Para correr todas las migraciones desde cero:

```bash
npx prisma migrate reset
```
