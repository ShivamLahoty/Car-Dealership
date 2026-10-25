FROM node:20.18.1-bookworm

WORKDIR /app

COPY backend/package*.json ./
RUN npm install
RUN npm rebuild better-sqlite3 --build-from-source

COPY backend/ ./
RUN npm run build

CMD ["sh", "-c", "node dist/seed.js && node dist/server.js"]