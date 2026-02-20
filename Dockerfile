## Stage 1: Base
FROM node:22-alpine AS base
RUN apk add --no-cache ca-certificates
RUN adduser -D -u 10001 appuser

## Stage 2: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

## Stage 3: Runtime
FROM base AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
USER appuser
EXPOSE 8080
CMD ["node", "dist/server/index.js"]
