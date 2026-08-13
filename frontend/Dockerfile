# Stage 1: Build Frontend App
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json bun.lock* ./
RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# Stage 2: Serve Build via Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
