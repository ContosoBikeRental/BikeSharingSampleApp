# Contoso BikeRental Sample Application

## Azure Dev Spaces

1. Create an AKS cluster with Azure Dev Spaces by running the following script, specifying the AKS name and region:
    
    ```
    source ./create-aks.sh bikesharing01 eastus2
    ```

    This sets up an AKS cluster named `bikesharing01` in resource group `bikesharing01` in the `eastus2` region.

2. Set the environment variable for Gateway API Service URL.

    a) Check your AKS cluster's zone name: 
    
    `az aks show -g $AKS_NAME -n $AKS_NAME -o json --query addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName`

    b) Open the web frontend's azds.yaml: `code ./bikesharingweb/azds.yaml`

    c) Change the `apiHost` line to use your AKS zone name. It will look something like:
        
    ```
    set:
        apiHost: gateway.3974a66c33074d1eb8d1.eastus2.aksapp.io
    ```
    d) Close and save the file.

3. Run the app's API and Data services, including setting up sample data.

    ```
    source ./azdsup-contoso-bikerental.sh
    ``` 
    Tip: Ensure you run the above command from the source repository's root folder.

4. Open the web frontend in a browser (the previous command will display the web frontend's url in its output, e.g. http://bikesharingweb...aksapp.io). 

    **Note:** You may need to wait several minutes for the DNS entry to be propagated, you can check back by running `azds list-uris`

    Sign into the web app using one of the sample customer accounts, as defined in the file `PopulateDatabase/app/data.json`.


<!-- ## Docker-Compose usage
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
``` -->
