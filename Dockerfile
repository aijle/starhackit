FROM node:5.12-onbuild

RUN npm install gulp -g

RUN mkdir /tmp/server
WORKDIR /tmp/server
COPY ./server/package.json package.json
RUN npm install

RUN mkdir /tmp/client
WORKDIR /tmp/client
COPY ./client/package.json package.json
RUN npm install

VOLUME /app
WORKDIR /app
