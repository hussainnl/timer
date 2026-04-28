FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# لو عندك build (Vite مثلاً)
RUN npm run build

EXPOSE 3000

CMD ["node", "server/index.js"]