# Next.js Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (excluding backend directory)
COPY . .
RUN rm -rf backend

# Expose port
EXPOSE 3005

# Start the application in development mode
CMD ["npm", "run", "dev", "--", "--port", "3005"]