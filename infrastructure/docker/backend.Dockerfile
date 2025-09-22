FROM node:18-alpine AS builder

WORKDIR /app
COPY backend/package*.json ./
COPY shared/ ../shared/
RUN cd ../shared && npm install && npm run build
RUN npm ci --only=production

COPY backend/ .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiserver

COPY --from=builder --chown=apiserver:nodejs /app/dist ./dist
COPY --from=builder --chown=apiserver:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=apiserver:nodejs /app/package.json ./package.json

USER apiserver

EXPOSE 3001

CMD ["npm", "start"]
