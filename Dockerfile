FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (needed for build)
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build production bundles
RUN node ./scripts/prepareDevLibs.js && \
    npx webpack --mode production --progress

# ---- Runtime stage ----
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    JITSI_BACKEND=https://alpha.jitsi.net

# Copy only prod dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built files and static assets from builder
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/css ./css
COPY --from=builder /app/images ./images
COPY --from=builder /app/fonts ./fonts
COPY --from=builder /app/sounds ./sounds
COPY --from=builder /app/lang ./lang
COPY --from=builder /app/static ./static
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/title.html ./title.html
COPY --from=builder /app/head.html ./head.html
COPY --from=builder /app/body.html ./body.html
COPY --from=builder /app/fonts.html ./fonts.html
COPY --from=builder /app/config.js ./config.js
COPY --from=builder /app/interface_config.js ./interface_config.js
COPY --from=builder /app/pwa-worker.js ./pwa-worker.js
COPY --from=builder /app/manifest.json ./manifest.json
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
