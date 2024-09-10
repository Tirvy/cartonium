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
#EXPOSE 3000
#EXPOSE 80
