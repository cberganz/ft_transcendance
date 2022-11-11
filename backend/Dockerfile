FROM node:lts-alpine

COPY ./ /app/

RUN apk update

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
