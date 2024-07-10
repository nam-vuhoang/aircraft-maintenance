# Frontend Dockerfile
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
ARG VITE_API_BASE_URL
ARG VITE_LOG_LEVEL
RUN yarn build

# Use a lightweight web server to serve the built files
FROM node:22-alpine

# Install serve globally
RUN npm install -g serve

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port
EXPOSE 5173

# Start the server
CMD ["serve", "-s", "/app/dist", "-l", "5173"]
