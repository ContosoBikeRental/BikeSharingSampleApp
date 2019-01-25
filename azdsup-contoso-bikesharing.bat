@echo off
rem Script to deploy contoso bikrental services in the parent space.

rem Select parent space. If space is not defined, set parent space to default.
set parent_space="$1"
if "%1%"=="" (set parent_space="default")
azds space select -n %parent_space%

rem Run all services
echo ******************************************
echo Starting databases: SQL, Mongo
echo ******************************************
cd Databases
helm init --wait
helm install charts/databases --wait
cd ..

set services=Gateway bikesharingweb Bikes Billing Reservation ReservationEngine Users DevSite PopulateDatabase

for %%s in (%services%) do (
    cd %%s
    echo ******************************************
    echo Starting service %%s
    echo
    azds up -d
    cd ..
)

echo ******************************************
echo BikeSharing endpoints:
azds list-uris
