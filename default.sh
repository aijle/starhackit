#!/bin/bash
if [ ! -d /app/server/node_modules ]
then
  cd /app/server && npm install
fi

if [ ! -d /app/client/node_modules  ]; then
  cd /app/client && npm install
fi

{
  cd /app/server && npm start
} &

{
  cd /app/client && npm start
} &

wait
