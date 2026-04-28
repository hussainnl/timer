# ── Stage 1: Build Frontend ──────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Install Backend deps ────────────────────────────────
FROM node:22-alpine AS backend-builder

WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 3: Final monolith image ────────────────────────────────
FROM node:22-alpine

# Install Nginx + Supervisor
RUN apk add --no-cache nginx supervisor

# ── Frontend assets ──
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /app/index.html     /usr/share/nginx/html/index.html
COPY --from=frontend-builder /app/src/css/output.css /usr/share/nginx/html/src/css/output.css
COPY --from=frontend-builder /app/dist           /usr/share/nginx/html/dist

# ── Backend ──
WORKDIR /app
COPY --from=backend-builder /app/node_modules ./node_modules
COPY server ./server
COPY data   ./data

# ── Supervisor config ──
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV PORT=3000

EXPOSE 80 3000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]