#!/bin/bash

if [ "x$@" = "xwait" ] ; then
    if [ "x$NODE_ENV" = "xproduction" ] ; then
        while true ; do
            date
            npm start
            sleep 300
        done
    else
        echo NODE_ENV já definido: $NODE_ENV
        npm run $NODE_ENV
    fi
    sleep 60
else
    echo Executando comando: $@
    $@
fi
