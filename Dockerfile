# Dockerfile

# Use an official Node.js runtime as the base image
FROM node:20-alpine

# ARGS for js usage
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG NUXT_BOT_TOKEN
ARG NUXT_TELEGRAM_PASSWORD_GENERATOR
ARG NUXT_BOT_LOGER_TOKEN
ARG NUXT_BOT_LUBA_TOKEN
ARG NUXT_BOT_LUBA_SPREADSHEET

# ARGS for docker build
ARG GOOGLE_CREDS_URL
ARG SUPABASE_ACCESS_TOKEN
ARG NITRO_PORT=80
ARG PORT=80

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Getting gcreds
# ADD ${GOOGLE_CREDS_URL} creds.json
RUN apk add --update wget && \
    wget -O creds.json `echo ${GOOGLE_CREDS_URL} | tr -d \'`

# Setup local supabase
RUN npx supabase login --token ${SUPABASE_ACCESS_TOKEN}
RUN mkdir .generated
RUN npm run type

# Install dependencies
# limited to 1000 cuz current hosting is this much powerfull @tirvy
RUN NODE_OPTIONS=--max_old_space_size=900 npm install


# Copy the rest of the application files to the container
COPY . .

# Build the Next.js application for production
# limited to 1000 cuz current hosting is this much powerfull @tirvy
RUN NODE_OPTIONS=--max-old-space-size=900 npm run build


ENV PORT=$PORT
ENV NODE_ENV=production

#EXPOSE 3000
#EXPOSE 80
EXPOSE ${NITRO_PORT}
CMD ["node", ".output/server/index.mjs"]
