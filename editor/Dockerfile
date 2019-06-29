FROM node:lts-slim as build

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:alpine as editor
LABEL maintainer="Andreas Offenhaeuser <https://anoff.io>"
COPY --from=build /app/dist /usr/share/nginx/html