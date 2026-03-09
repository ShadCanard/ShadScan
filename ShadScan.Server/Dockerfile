# Combined Dockerfile for front + back
# Builds both backend and frontend in a single image

# builder stage
FROM node:25-alpine AS builder
WORKDIR /app

# -------- backend build --------
COPY backend/package*.json ./backend/
COPY backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci
COPY backend/ ./
RUN npx prisma generate && npm run build

# -------- frontend build --------
WORKDIR /app
COPY frontend/package*.json ./frontend/
COPY frontend/package-lock.json ./frontend/
WORKDIR /app/frontend
RUN npm ci
COPY frontend/ ./
RUN npm run build
RUN npm prune --production

# runtime stage
FROM node:25-alpine AS runtime
# create a non-root user and group
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# copy backend artifacts
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/

# copy frontend artifacts
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend/package*.json ./frontend/
COPY --from=builder /app/frontend/public ./frontend/public

# copy entrypoint script
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN chown -R app:app /app

USER app

EXPOSE 4000 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD nc -z localhost 4000 || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# default command is now handled within script which launches both services