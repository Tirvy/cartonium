FROM node:18-alpine
WORKDIR /my-nuxt-app
COPY . /my-nuxt-app
RUN npm ci
RUN nuxt build
EXPOSE 80 443
CMD ["node", ".output/server/index.mjs"]
