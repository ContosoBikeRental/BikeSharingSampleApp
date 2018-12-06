#!/bin/bash
# Create folder with charts for all services. 
# Run before helm install.
rm -rf contoso-bikerental/charts
mkdir -p contoso-bikerental/charts
cp -R Bikes/charts/bikes/. contoso-bikerental/charts/bikes/
cp -R Gateway/charts/gateway/. contoso-bikerental/charts/gateway/
cp -R ReservationEngine/charts/reservationengine/. contoso-bikerental/charts/reservationengine/
cp -R Users/charts/users/. contoso-bikerental/charts/users/
cp -R DevSite/charts/devsite/. contoso-bikerental/charts/devsite/
cp -R Billing/charts/billing/. contoso-bikerental/charts/billing/
cp -R Reservation/charts/reservation/. contoso-bikerental/charts/reservation/
cp -R Databases/charts/databases/. contoso-bikerental/charts/databases/