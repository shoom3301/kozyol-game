FROM node:12.14 as build-env

WORKDIR /usr/src/app

COPY package.json .
ENV NODE_ENV=production
RUN yarn install --production=false

COPY . .
RUN yarn build \
  && rm -rf node_modules && yarn install --production

#
FROM node:12.14.0-buster-slim as prod-build

USER node

WORKDIR /home/app

ENV NODE_ENV=production
EXPOSE 8041

COPY --from=build-env /usr/src/app/dist/. ./dist
COPY --from=build-env /usr/src/app/node_modules/ ./node_modules
