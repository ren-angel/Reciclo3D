# ------------------------
# Estágio 1 — Build
# ------------------------
FROM node:24-alpine AS builder

WORKDIR /frontend

# Copies package.json and package-lock.json to the working directory
COPY package*.json /frontend/

# Install dependencies using npm ci for a clean install (faster and more reliable)
RUN npm ci

# Copies the rest of the application code to the working directory
COPY . .

# Build the application using TypeScript compiler and then run the build script
RUN npx tsc && npm run build

# ------------------------
# Estágio 2 — NGINX Execution
# ------------------------
FROM nginx:1.26-alpine AS runtime

# Removes the default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copies the built application from the builder stage to the nginx html directory
COPY --from=builder /frontend/dist /usr/share/nginx/html

# Replaces the default nginx configuration with our custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Replaces the default server configuration with our custom configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Exposes port 80 for the nginx server
EXPOSE 80

# Runs nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]