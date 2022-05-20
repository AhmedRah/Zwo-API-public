FROM node:latest

# create app directory  
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Install app dependencies
COPY package.json /usr/src/api/
RUN npm install

# Bundle app source
COPY . /usr/src/api/

EXPOSE 8081
RUN chmod 777 ./entrypoint.sh
CMD ["./entrypoint.sh"]
