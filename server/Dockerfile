FROM node:latest

RUN mkdir /app
VOLUME /app
WORKDIR /app

COPY package.json /app/package.json
RUN npm install gulp -g
RUN npm install --loglevel warn
EXPOSE 8000

CMD ["npm", "start"]
