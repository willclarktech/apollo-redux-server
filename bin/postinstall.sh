#!/bin/sh
if [ ! -d logs ]; then
  mkdir logs
fi

./bin/install-filebeat.sh

