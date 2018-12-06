#!/bin/bash
# Script to deploy contoso bikrental services in the parent space.

# Select parent space. If space is not defined, set parent space to default.
parent_space="$1"
if [ -z "$1" ]; then
    parent_space="default"
fi

# Selecting azds namespace.
echo deploy-contoso-bikerental.sh : Setting parent space to $parent_space...
azds space select -n $parent_space

# Copy over charts for all services. 
echo deploy-contoso-bikerental.sh : Synching charts...
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
cp -R PopulateDatabase/charts/populatedatabase/. contoso-bikerental/charts/populatedatabase/


# Deploy the contoso bikerental services and databases.
echo deploy-contoso-bikerental.sh : Upgrading Helm...
helm init --upgrade
echo deploy-contoso-bikerental.sh : Deleting old release...
helm del --purge default
echo deploy-contoso-bikerental.sh : Deploying charts...
helm install ./contoso-bikerental/ --name default
echo deploy-contoso-bikerental.sh : Script completed.