# Use official Node.js base image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY . .

# Install dependencies and build the app
RUN npm install
RUN npm run build || tail -n 100 /app/node_modules/.vite/deps_temp/* || true


# Use Nginx to serve the built app
FROM nginx:stable-alpine

# Copy build output to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
