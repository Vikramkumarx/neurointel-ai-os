# Use Node.js 22 for better compatibility with modern packages
FROM node:22

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install --engine-strict=false
RUN npm run build

# Return to root
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=7860

# Expose the port (Hugging Face uses 7860)
EXPOSE 7860

# CMD to run the backend server which serves the frontend in production
CMD ["node", "backend/server.js"]
