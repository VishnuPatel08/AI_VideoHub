# Builder stage
FROM node:20-alpine AS builder

# Declare build args
ARG NEXT_PUBLIC_URL_ENDPOINT
ARG NEXT_PUBLIC_PUBLIC_KEY

# Make them available as env vars during build
ENV NEXT_PUBLIC_URL_ENDPOINT=$NEXT_PUBLIC_URL_ENDPOINT
ENV NEXT_PUBLIC_PUBLIC_KEY=$NEXT_PUBLIC_PUBLIC_KEY


WORKDIR /app
# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Declare build args for runtime use
ARG NEXT_PUBLIC_URL_ENDPOINT
ARG NEXT_PUBLIC_PUBLIC_KEY

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_URL_ENDPOINT=$NEXT_PUBLIC_URL_ENDPOINT
ENV NEXT_PUBLIC_PUBLIC_KEY=$NEXT_PUBLIC_PUBLIC_KEY

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the app
CMD ["npm", "start"]