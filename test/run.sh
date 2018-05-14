#!/bin/sh


start() {
    docker-compose up -d --build
}

stop() {
    docker-compose down
}
ACTION=${1}
shift

INSTANCE=${2:-xray}
shift

case $ACTION in
    update)
        mkdir -p roles
        ansible-galaxy install --roles-path ./roles -r requirements.yml
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        start
        ;;
    shell)
        docker-compose exec $INSTANCE bash
        ;;
    log)
        docker-compose exec $INSTANCE journalctl -f
        ;;
    *)
        echo "Unknown action: ${ACTION}"
        exit 1
        ;;
esac
