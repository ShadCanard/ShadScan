# backend Dockerfile
FROM node:18-alpine
WORKDIR /app

# install dependencies
COPY backend/package*.json ./
RUN npm install

# copy source
COPY backend/ ./

# generate prisma client now that schema is present
RUN npx prisma generate

# default env, override in compose
ENV DATABASE_URL="mysql://root:example@db:3306/scan_manager"

# copy entrypoint script and make executable
COPY backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["sh","-c","npm run dev"]