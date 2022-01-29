### Start containers
Go to repo and run

`docker-compose -f docker/docker-compose.yml up --build --force-recreate -d`

It will create all necessary container with apps and starts it

### Quickfix for expired ssl cert

#### Kill all containers

`docker stop $(docker ps -aq)`

#### Stop volumes

`docker-compose down --volumes`

#### Remove letsencrypt volume

`docker volume rm -f docker_letsencrypt`

#### Run containers back

`docker-compose -f docker/docker-compose.yml up --build --force-recreate -d`
