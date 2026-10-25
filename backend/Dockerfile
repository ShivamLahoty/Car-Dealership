FROM node:22-bookworm

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

CMD ["sh", "-c", "node dist/seed.js && node dist/server.js"]