FROM node:latest as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build

# FROM nginxinc/nginx-unprivileged:alpine
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# WORKDIR /usr/share/nginx/html

# COPY ./env.sh .
# COPY .env .

RUN apk update \
  && apk --no-cache add curl bash \
  && sed -i '/location \/ {$/a try_files \$uri \/index.html;' /etc/nginx/conf.d/default.conf

# RUN chmod +x env.sh

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
# CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
