FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app
FROM node:20-alpine AS runner

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="mysql://root:kinkhoorn@192.168.1.17:3306/trips_map"

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
