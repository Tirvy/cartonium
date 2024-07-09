FROM node:18-alpine
WORKDIR /my-nuxt-app
COPY . /my-nuxt-app
RUN npm ci
RUN npm run build
EXPOSE 80
EXPOSE 443
CMD ["node", ".output/server/index.mjs"]
