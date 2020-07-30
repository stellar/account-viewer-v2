FROM ubuntu:16.04 as build

MAINTAINER SDF Ops Team <ops@stellar.org>

RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock tsconfig.json /app/
COPY src /app/src
COPY public /app/public

RUN apt-get update && apt-get install -y curl git make apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "deb https://deb.nodesource.com/node_10.x xenial main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

RUN yarn install
