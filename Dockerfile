FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 최종 런타임 이미지
FROM node:18-alpine
WORKDIR /app
COPY .env.production .env 
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]