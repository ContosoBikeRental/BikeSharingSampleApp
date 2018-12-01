# Contoso BikeRental Package repo
This repository contains submodule references to all the different microservices that make up the BikeRental application. There are also global setup files contained here for deploying the entire BikeRental application locally or in a Kubernetes cluster.

## Initial Setup
When you first clone this repository, you'll need to initialize the submodules with the following commands at repo root:
```
git submodule init
git submodule update
```
(Many Git clients will do this for you, eg. SourceTree)

## Docker-Compose usage
The docker-compose file defines all the necessary services to run the application locally. All you need to do (other than install Docker and docker-compose) is run:
```
docker-compose up --build --abort-on-container-exit
```

## Kubernetes usage
This application is designed to be deployed to Kubernetes using the Helm package manager: [https://helm.sh/](https://helm.sh/)  Note that after installation, you must initialize Helm on your cluster by executing `helm init`.  This will install the cluster-side component "`Tiller`".
_PREREQUISITE: You must also have the `kubectl` utility installed, and configured for communication with your cluster_

Each microservice repository defines its own Helm Chart. To accumulate them and put them in the right place, execute:
```
./get_charts.sh
```

In order for Kubernetes to pull the images, they need to be hosted somewhere. We've provided a helper script for building the images, tagging them appropriately, and pushing them to a private repository.
_PREREQUISITE: You must have previously executed `docker login` for your private repository._

To build, tag, and push all images, execute:
```
Linux:
./build_tag_push.sh <private repo hostname> <tag>

Windows:
.\build_tag_push.bat <private repo hostname> <tag>
```
_IMPORTANT: You must also configure the appropriate private repo and tag in the `values.yaml`, so that each microservice is configured to pull from the correct repo._

Once `kubectl` and `helm` have been installed/configured, all images have been pushed, and all charts are in their correct locations, you can deploy the service to your cluster by simply executing:
```
helm install contoso-bikerental/
```

This command will generate the final Kubernetes templates using the values.yaml, push them to Tiller, and deploy them to your cluster.

### Overriding default params
Out-of-the-box, the Kubernetes Helm Chart uses purely in-cluster resources for databases and queues; similar to the docker-compose flow.  (Each infra service unique to each release.)  To use Azure PaaS services or other external services instead, simply override the relevant connection strings, etc, in the `values.yaml` file in the `contoso-bikerental/` Chart folder.  Also make sure to set `enabled: false` for any services you do not wish to host in the cluster. (At the top of the `values.yaml` file)

## AZDS Usage
This application can also be used with Azure Dev Spaces (AZDS): [https://docs.microsoft.com/en-us/azure/dev-spaces/](https://docs.microsoft.com/en-us/azure/dev-spaces/). To deploy this application with AZDS, execute:
```
Linux:
./azdsup-contoso-bikerental.sh

Windows:
./azdsup-contoso-bikerental.bat
```
