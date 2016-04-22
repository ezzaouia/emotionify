#!/bin/bash

function print_menu() {
    echo -e "\n available cmd are :\n "
    echo -e "\t build \t build image docker-compose"
    echo -e "\t up \t run docker-compose container with nohup output in nohup.out"
    echo -e "\t uplog \t run docker-compose with docker-compose log"
    echo -e "\t stop \t shutdown"
    echo -e "\t -h \t help"
    echo
}

if [ -z $1 ] || [ $1 = "-h" ] || [ $1 = "--help" ] || [ $1 = "-help" ]
then
    print_menu
fi

if [ $1 = "build" ]
then
    echo -e "\n\t==> Starting building image docker-compose"
    docker-compose build
    echo -e "\n\t building done. <=="

# uplog
elif [ $1 = "uplog" ]
then
    echo -e "\n\t ==> Starting docker-compose \n"
    docker-compose up

# up
elif [ $1 = "up" ]
then
    echo -e "\n\t ==> Starting docker-compose nohup & tail"
    nohup docker-compose up &
    echo -e "\n\t done done. <=="

# stop
elif [ $1 = "stop" ]
then
    echo -e "\n\t ==> Stopping docker-compose"
    docker-compose down
    echo "\n\t shutdown done. <=="
else
    print_menu
fi

