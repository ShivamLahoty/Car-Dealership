FROM node:20.18.1-bookworm

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm rebuild better-sqlite3 --build-from-source

COPY . .
RUN npm run build

CMD ["sh", "-c", "node dist/seed.js && node dist/server.js"]