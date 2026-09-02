FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Start the application
EXPOSE 4000
CMD ["npm", "start"]
