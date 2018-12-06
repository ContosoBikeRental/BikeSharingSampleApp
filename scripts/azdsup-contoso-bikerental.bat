@echo off
rem Script to azds up contoso bikrental services in the parent space.

rem Select parent space. If space is not defined, set parent space to default.
set parent_space=%1%
if "%1%"=="" (set parent_space="default")
echo [ %~nx0 ] : Setting parent space to %parent_space%...
azds space select -n %parent_space%

rem Shut down all services.
for /D %%s in (.\*) do (
    cd %%s
    echo [ %~nx0 ] : Shutting down %%s...
    azds down -y
    cd ..
)

rem Run all services.
for /D %%s in (.\*) do (
    cd %%s 
    echo [ %~nx0 ] : Starting up %%s...
    azds up -d
    cd ..
)

echo [ %~nx0 ] : Script completed.

pause