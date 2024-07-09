# Dockerfile

# Use an official Node.js runtime as the base image
FROM node:18-alpine

# ARGS
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG NUXT_BOT_TOKEN
ARG NUXT_TELEGRAM_PASSWORD_GENERATOR
ARG NITRO_PORT
RUN echo "SUPABASE_URL is ${SUPABASE_URL}"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Next.js application for production
RUN npm run build

#EXPOSE 3000
EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
