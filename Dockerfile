# Stage 1: Build the app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app
FROM node:20-alpine AS runner

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tsconfig.json ./

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

