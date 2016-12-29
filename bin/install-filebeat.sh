#!/bin/sh
# https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation.html

mkdir filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-5.1.1-darwin-x86_64.tar.gz
tar xzvf filebeat-5.1.1-darwin-x86_64.tar.gz -C filebeat
