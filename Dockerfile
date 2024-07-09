# Dockerfile

# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Next.js application for production
RUN npm run generate

EXPOSE 80
EXPOSE 443
CMD ["node", ".output/server/index.mjs"]
