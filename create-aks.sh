AKS_NAME="$1"
if [ -z "$1" ]; then
    AKS_NAME="bikesharing01"
fi

AKS_REGION="$2"
if [ -z "$2" ]; then
    AKS_REGION="eastus2"
fi

echo "===================================="
echo "creating group: " $AKS_NAME
az group create --name $AKS_NAME --location $AKS_REGION 

echo "===================================="
echo "creating AKS cluster: " $AKS_NAME
az aks create -g $AKS_NAME -n $AKS_NAME --location $AKS_REGION --kubernetes-version 1.12.4 --enable-addons http_application_routing --node-vm-size Standard_DS2_v2 --node-count 3 --generate-ssh-keys --disable-rbac

echo "===================================="
echo "enabling Dev Spaces for AKS cluster: " $AKS_NAME
az aks use-dev-spaces -g $AKS_NAME -n $AKS_NAME -s default -y
