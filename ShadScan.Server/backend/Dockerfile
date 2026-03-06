# backend Dockerfile
# multi-stage build: first install deps and generate client, then copy only necessary files

# builder stage
FROM node:25-alpine AS builder
WORKDIR /app

# install all dependencies (including dev) so we can compile
COPY backend/package*.json ./
COPY backend/package-lock.json ./
RUN npm ci

# copy source, generate prisma client (types needed for tsc) and then compile
COPY backend/ ./
RUN npx prisma generate && npm run build

# runtime stage
FROM node:25-alpine AS runtime
# create a non-root user and group
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# copy compiled artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# set proper ownership and permissions
RUN chown -R app:app /app

# copy entrypoint and make executable
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER app

EXPOSE 4000

# healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD nc -z localhost 4000 || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# production start
CMD ["sh","-c","npm run start"]
