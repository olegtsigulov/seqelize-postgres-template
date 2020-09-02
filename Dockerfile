FROM node:latest

RUN mkdir -p /usr/src/main
WORKDIR /usr/src/main

ENV NPM_CONFIG_LOGLEVEL warn
COPY ./package.json ./
COPY ./package-lock.json ./

RUN yarn
COPY . .
RUN yarn run build
CMD ["yarn", "run", "start:prod"]
