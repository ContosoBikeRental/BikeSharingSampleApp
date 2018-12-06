@echo off
if "%1"=="" (echo "You must specify a private registry DNS name as first arg" & goto DONE)
if "%2"=="" (echo "You must specify an image tag as second arg" & goto DONE)

docker build -t "%1/contoso-bikerental-bikes:%2" Bikes/
docker build -t "%1/contoso-bikerental-gateway:%2" Gateway/
docker build -t "%1/contoso-bikerental-reservationengine:%2" ReservationEngine/
docker build -t "%1/contoso-bikerental-users:%2" Users/
docker build -t "%1/contoso-bikerental-devsite:%2" DevSite/
docker build -t "%1/contoso-bikerental-billing:%2" Billing/
docker build -t "%1/contoso-bikerental-reservations:%2" Reservation/
docker build -t "%1/contoso-bikerental-populatedatabase:%2" PopulateDatabase/
docker build -t "%1/contoso-bikerental-databases:%2" Databases/


docker push "%1/contoso-bikerental-bikes:%2"
docker push "%1/contoso-bikerental-gateway:%2"
docker push "%1/contoso-bikerental-reservationengine:%2"
docker push "%1/contoso-bikerental-users:%2"
docker push "%1/contoso-bikerental-devsite:%2"
docker push "%1/contoso-bikerental-billing:%2"
docker push "%1/contoso-bikerental-reservations:%2"
docker push "%1/contoso-bikerental-populatedatabase:%2"
docker push "%1/contoso-bikerental-databases:%2"

:DONE