FROM node:7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY ./app /usr/src/app
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]