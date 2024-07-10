# Backend Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the port
EXPOSE 3000

# Combine the migration and start commands into a single script
CMD ["sh", "-c", "yarn run typeorm:migration:run && yarn start:prod"]
