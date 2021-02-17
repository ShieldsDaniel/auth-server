FROM node:lts-alpine

RUN mkdir -p /usr/src/app/data

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY .env /usr/src/app/
COPY .env.test /usr/src/app/
# COPY wait-for-it.sh /user/src/app/
COPY wait-for-mongo.sh /usr/src/app/

RUN npm install

EXPOSE 3000
