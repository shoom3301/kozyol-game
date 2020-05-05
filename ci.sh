#/bin/bash

cd client
npm run build
cd ../backend
npm run build
cd ../
rm -rf dist
mkdir dist
cp -R client/build dist/client
cp -R backend/dist dist/backend
