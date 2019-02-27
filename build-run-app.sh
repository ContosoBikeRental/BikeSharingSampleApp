#!/bin/bash
# Script to deploy contoso bikrental services in the parent space.

# Select parent space. If space is not defined, set parent space to default.
parent_space="$1"
if [ -z "$1" ]; then
    parent_space="dev"
fi

# Selecting azds namespace.
azds space select -n $parent_space

# Run all services
echo "******************************************"
echo "Starting databases: SQL, Mongo"
echo "******************************************"
pushd Databases
helm init --wait
helm install charts/databases --wait --namespace $parent_space
popd

declare -a arr=("Gateway" "bikesharingweb" "Bikes" "Billing" "Reservation" "ReservationEngine" "Users" "DevSite" "PopulateDatabase")
for i in "${arr[@]}"
do
   echo "******************************************"
   echo "Starting service $i"
   echo "******************************************"
   pushd $i
   azds up -d
   popd
done


echo "******************************************"
echo "BikeSharing endpoints: "
azds list-uris
