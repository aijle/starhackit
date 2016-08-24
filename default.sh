#!/bin/bash
if [ ! -d /app/server/node_modules ]
then
  cp -r /tmp/server/node_modules /app/server/node_modules
fi

if [ ! -d /app/client/node_modules  ]; then
  cp -r /tmp/client/node_modules /app/client/node_modules
fi

{
  cd /app/server && npm start
} &

{
  cd /app/client && npm start
} &

wait
