# ------------------------
# Stage 1 — Build Stage
# ------------------------

# Official Node.js 18 Alpine image for the build stage
FROM node:24-alpine AS builder

# Set the working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json (for clean install) into the container
COPY package*.json /backend/

# Install all dependencies using a clean install for consistency and speed
RUN npm ci

# Copy the rest of the application source code into the container
COPY . .

# Build the application (typically compiles TypeScript or bundles frontend code)
RUN npm run build

# ------------------------
# Stage 2 — Runtime Stage
# ------------------------

# Use a fresh Node.js 18 Alpine image for the final runtime container (smaller and cleaner)
FROM node:24-alpine

# Set the working directory inside the runtime container
WORKDIR /backend

# Set the environment variable to production to optimize performance
# ENV NODE_ENV=production

# Copy only the built output and package.json and package-lock.json (for clean install) file from the build stage
COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/package*.json ./

# Install only production dependencies (devDependencies are skipped)
RUN npm ci --only=production

# Expose port 3000 (so external systems know which port the app runs on)
EXPOSE 3000

# Define the default command to start the application
CMD ["npm", "run", "start:prod"]
