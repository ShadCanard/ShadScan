# frontend Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

EXPOSE 3000
CMD ["sh","-c","npm run dev"]
