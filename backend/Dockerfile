# ── Stage 1: Base ─────────────────────────────────────────
# Use the official Node.js LTS image on Alpine Linux
# Alpine is tiny (~5MB) vs full Ubuntu (~200MB)
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (Docker layer caching trick)
# If package.json hasn't changed, Docker skips npm install
# and uses the cached layer — much faster rebuilds
COPY package*.json ./

# Install only production dependencies (no nodemon etc.)
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Expose the port Express listens on
EXPOSE 3001

# Health check — Docker will restart the container if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

# Start the server
CMD ["node", "src/server.js"]