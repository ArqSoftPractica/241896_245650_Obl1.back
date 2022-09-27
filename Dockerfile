#
# Builder stage.
#
FROM node:16 AS builder

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./src ./src

RUN npm i --quiet && npm run build

#
# Production stage.
#
FROM node:16-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./

RUN npm i --quiet --only=production --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 80 

CMD [ "npm", "run", "start" ]
