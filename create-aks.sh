AKS_NAME="$1"
if [ -z "$1" ]; then
    AKS_NAME="bikesharing01"
fi

AKS_REGION="$2"
if [ -z "$2" ]; then
    AKS_REGION="eastus2"
fi

K8S_VERSION="$3"
if [ -z "$3" ]; then
    K8S_VERSION="1.12.5"
fi

parent_space="$4"
if [ -z "$4" ]; then
    parent_space="dev"
fi

echo "===================================="
echo "creating group: " $AKS_NAME
az group create --name $AKS_NAME --location $AKS_REGION 

echo "===================================="
echo "creating AKS cluster: " $AKS_NAME
az aks create -g $AKS_NAME -n $AKS_NAME --location $AKS_REGION --kubernetes-version $K8S_VERSION --node-vm-size Standard_DS2_v2 --node-count 1 --generate-ssh-keys --disable-rbac

echo "===================================="
echo "enabling Dev Spaces for AKS cluster: " $AKS_NAME
az aks use-dev-spaces -g $AKS_NAME -n $AKS_NAME -s $parent_space -y
