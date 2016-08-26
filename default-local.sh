#!/bin/bash
BASHDIR=$(pwd)
SERVERDIR=$BASHDIR"/server"
SERVERNODE=$BASHDIR"/server/node_modules"
CLIENTDIR=$BASHDIR"/client"
CLIENTNODE=$BASHDIR"/client/node_modules"

if [ ! -d $SERVERNODE ]
then
  cd $SERVERDIR && npm install
fi

if [ ! -d $CLIENTNODE  ]; then
  cd $CLIENTDIR && npm install
fi

{
  cd $SERVERDIR && npm start
} &

{
  cd $CLIENTDIR && npm start
} &

wait
