#!/bin/bash

# test
echo 'Start deploying......'

# start psql docker
docker start 8770 &&

  # pull latest source code from github
  cd /home/bloger/app &&
  git pull &&

  # install dependencies and devDependencies and build
  yarn install --production=false &&
  yarn build &&

  # docker builds and runs the container
  docker build -t rfzhu/node-web-app . &&
  docker kill app &&
  docker rm app &&
  docker run --name app --network=host -p 3000:3000 -d rfzhu/node-web-app &&
  echo 'Finished!'
