# build environment
FROM node:14.17.6 as build

ARG hasura_ws_url
ARG hasura_api_url
ARG auth_keycloak_url
ARG auth_service="bolt"
ARG api_service_url
ARG argo_url
ARG auth0_domain
ARG auth0_client
ARG auth0_audience

ENV REACT_APP_AUTH_SERVICE=$auth_service
ENV REACT_APP_API_SERVICE_BASE_URL=$api_service_url
ENV REACT_APP_KEYCLOAK_URL=$auth_keycloak_url
ENV REACT_APP_HASURA_WS_URL=$hasura_ws_url
ENV REACT_APP_HASURA_API_URL=$hasura_api_url
ENV REACT_APP_ARGO_URL=$argo_url
ENV REACT_APP_AUTH0_DOMAIN=$auth0_domain
ENV REACT_APP_AUTH0_CLIENT_ID=$auth0_client
ENV REACT_APP_AUTH0_AUDIENCE=$auth0_audience

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY package.json ./
COPY public ./public/
COPY src ./src/
COPY .babelrc ./
COPY jsconfig.json ./

RUN printenv
RUN yarn
RUN yarn build

# release environment
FROM nginx:1.21.6-alpine

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/
