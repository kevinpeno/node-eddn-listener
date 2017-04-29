FROM node:7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY ./src /usr/src/app/src
COPY ./package.json /usr/src/app
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
