FROM node:23 as build
MAINTAINER SDF Wallets Team <wallet-eng@stellar.org>

RUN mkdir -p /app
WORKDIR /app

COPY . /app/
RUN yarn install
RUN yarn build

FROM nginx:1.27

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
