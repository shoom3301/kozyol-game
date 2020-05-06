#/bin/bash

cd backend
npm run build
cd ../client
npm run build
cd ../
rm -rf dist
mkdir dist
cp -R backend/node_modules dist
cp -R backend/dist/* dist
cp -R client/build dist/client
