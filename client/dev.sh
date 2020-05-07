#/bin/bash

(docker stop kozyol_dev || true) && \
npm run build && \
docker build -f front.dev.Dockerfile . -t kozyol/front:dev && \
docker run --name=kozyol_dev --rm -d -p 8888:80 kozyol/front:dev