# Frontend Dockerfile
FROM node:20-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project
COPY . .

# Build the application
RUN npm run build || true

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
