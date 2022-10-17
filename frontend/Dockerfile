FROM node:alpine as build

WORKDIR /app
COPY . ./
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL

RUN apk update && apk upgrade

RUN npm install 
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN apk update \
  && apk add curl \
  && sed -i '/location \/ {$/a try_files \$uri \/index.html;' /etc/nginx/conf.d/default.conf

EXPOSE 80 
ENTRYPOINT ["nginx", "-g", "daemon off;"]
