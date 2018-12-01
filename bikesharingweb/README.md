# bikesharingweb
Bike Sharing web app built with Next.js

# Develop locally
``` bash
npm install
npm run dev
```
Open browser at http://localhost:3000

# Run in AKS with Dev Spaces
Assuming you have an AKS cluster and a Dev Space controller:
``` bash
# build locally
npm run build
npm run export

# Run in AKS
azds up
```