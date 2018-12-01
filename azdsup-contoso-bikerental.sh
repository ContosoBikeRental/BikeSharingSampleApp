#!/bin/bash
# Script to deploy contoso bikrental services in the parent space.

# Select parent space. If space is not defined, set parent space to default.
parent_space="$1"
if [ -z "$1" ]; then
    parent_space="default"
fi

# Selecting azds namespace.
echo Setting parent space to $parent_space...
azds space select -n $parent_space


# Shut down all services.
for d in */ do (
    cd "$d"
    echo Shutting down %%s...
    azds down -y
    cd ..
)

# Run all services.
for d in */ do (
    cd "$d"
    echo Shutting down %%s...
    azds up
    cd ..
)

echo Script completed.