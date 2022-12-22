FROM node:14-alpine as build
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/promerica-test /usr/share/nginx/html/