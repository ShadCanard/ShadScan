# frontend Dockerfile
# multi-stage build with non-root user and production optimizations

FROM node:25-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
COPY frontend/package-lock.json ./
# install all dependencies (including dev) to allow Next.js build and TS compile
RUN npm ci

COPY frontend/ ./

# build step (required for production output)
RUN npm run build

# optionally remove dev dependencies to reduce size
RUN npm prune --production

FROM node:25-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

RUN chown -R app:app /app
USER app

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD nc -z localhost 3000 || exit 1

CMD ["sh","-c","npm run start"]

