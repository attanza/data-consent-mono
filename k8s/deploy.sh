#! /bin/sh
# Config map
kubectl apply -f consentCfg.yml
# mongo
kubectl apply -f mongo-service.yml
# minio
kubectl apply -f minio-service.yml
# redis
kubectl apply -f redis-service.yml
# kafka
kubectl apply -f kafka-service.yml
# consent
kubectl apply -f consent-depl.yml
