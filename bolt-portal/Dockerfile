# build environment
FROM node:14.17.6 as build

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
COPY stitch_values.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/stitch_values.sh
