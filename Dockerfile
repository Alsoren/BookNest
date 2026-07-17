# 1. Aşama: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Aşama: Sunum (Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# React Router (Single Page App) yönlendirmelerinin düzgün çalışması için Nginx config gerekebilir.
# İhtiyacınız olursa default nginx.conf dosyasını ezebilirsiniz.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]