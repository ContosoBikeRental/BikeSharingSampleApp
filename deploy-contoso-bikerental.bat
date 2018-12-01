@echo off
rem Script to deploy contoso bikrental services in the parent space.

rem Select parent space. If space is not defined, set parent space to default.
set parent_space=%1%
if "%1%"=="" (set parent_space="default")
echo %~nx0 : Setting parent space to %parent_space%...
azds space select -n %parent_space%

rem Copy over charts for all services. 
echo %~nx0 : Synching charts...
rmdir /s /q contoso-bikerental\charts\
mkdir contoso-bikerental\charts\
mkdir contoso-bikerental\charts\bikes\
mkdir contoso-bikerental\charts\billing\
mkdir contoso-bikerental\charts\databases\
mkdir contoso-bikerental\charts\devsite\
mkdir contoso-bikerental\charts\gateway\
mkdir contoso-bikerental\charts\reservation\
mkdir contoso-bikerental\charts\reservationengine\
mkdir contoso-bikerental\charts\users\
mkdir contoso-bikerental\charts\populatedatabase\

xcopy Bikes\charts contoso-bikerental\charts /s /q > nul
xcopy Billing\charts contoso-bikerental\charts /s /q > nul
xcopy Databases\charts contoso-bikerental\charts /s /q > nul
xcopy DevSite\charts contoso-bikerental\charts /s /q > nul
xcopy Gateway\charts contoso-bikerental\charts /s /q > nul
xcopy Reservation\charts contoso-bikerental\charts /s /q > nul
xcopy ReservationEngine\charts contoso-bikerental\charts /s /q > nul
xcopy Users\charts contoso-bikerental\charts /s /q > nul
xcopy PopulateDatabase\charts contoso-bikerental\charts /s /q > nul

rem Deploy the contoso bikerental services and databases.
echo %~nx0 : Upgrading Helm...
helm init --upgrade
echo %~nx0 : Deleting old release...
helm del --purge default
echo %~nx0 : Deploying charts...
helm install .\contoso-bikerental\ --name default
echo %~nx0 : Script completed.

pause