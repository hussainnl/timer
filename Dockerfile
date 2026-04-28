FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/src/css/output.css /usr/share/nginx/html/src/css/output.css
COPY --from=builder /app/dist /usr/share/nginx/html/dist

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
