# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
 
# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
 
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env
COPY --from=builder /app/package.json ./
 
EXPOSE 5050
 
CMD ["node", "dist/server.js"]