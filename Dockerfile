# Build stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Install serve package globally
RUN npm install -g serve

# Expose port for production
EXPOSE 3000

# Start the production server
CMD ["serve", "-s", "dist", "-l", "3000"]