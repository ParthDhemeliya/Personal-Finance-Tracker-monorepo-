# Stage 1 - build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build   # compiles TypeScript into /dist

# Stage 2 - run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY package.json ./
EXPOSE 5050

# ✅ FIXED: Use shell form instead of JSON
CMD ["node", "dist/server.js"]
# CMD node dist/server.js