FROM node:7

COPY ./src /worker/src
COPY ./package.json /worker

WORKDIR /worker
RUN npm install
