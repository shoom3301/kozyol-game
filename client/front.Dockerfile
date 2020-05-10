FROM node:12.14.0-alpine as build-env

ENV NODE_ENV=production
ENV REACT_APP_PROD_HOST=https://skazhi.be

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install --production=false

COPY . .
RUN npm run build

FROM staticfloat/nginx-certbot as static-html
COPY --from=build-env /usr/src/app/build/ /usr/share/nginx/html