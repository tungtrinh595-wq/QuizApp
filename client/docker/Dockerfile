# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.23.3-alpine

WORKDIR /usr/share/nginx/html

# Dọn nginx mặc định
RUN rm /etc/nginx/conf.d/* \
    && rm -rf /usr/share/nginx/html/*

# Copy build và cấu hình nginx
COPY --from=build /app/dist .  
COPY --from=build /app/docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
