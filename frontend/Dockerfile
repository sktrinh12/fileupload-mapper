FROM node:latest as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . ./
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html


RUN apk update \
  && apk --no-cache add curl bash \
  && sed -i '/location \/ {$/a try_files \$uri \/index.html;' /etc/nginx/conf.d/default.conf


EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
