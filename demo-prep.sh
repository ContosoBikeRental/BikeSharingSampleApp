# Sample usage:
#    source ./demo-prep.sh bikesharing01 westus2

AKS_NAME="$1"
if [ -z "$1" ]; then
    AKS_NAME="bikesharing01"
fi

AKS_REGION="$2"
if [ -z "$2" ]; then
    AKS_REGION="eastus2"
fi

K8S_VERSION="$3"
if [ -z "$2" ]; then
    K8S_VERSION="1.12.5"
fi

parent_space="$4"
if [ -z "$4" ]; then
    parent_space="dev"
fi

# Prepare AKS cluster with Dev Spaces enabled
source ./create-aks.sh $AKS_NAME $AKS_REGION $K8S_VERSION

# Run bike sharing app
source ./build-run-app.sh $parent_space

# Create several child dev spaces
azds space select -y -n $parent_space/paula
azds space select -y -n $parent_space/yuval
azds space select -y -n $parent_space/stephen
azds space select -y -n $parent_space/lisa
azds space select -y -n $parent_space/john

# # Run the Bikes services in child space: john
# azds space select -n default/john
# cd ./Bikes
# azds up -d
# cd ..

# List available URIs for testing from dev space "john" 
azds list-uris
