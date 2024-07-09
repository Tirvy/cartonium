FROM node:18-alpine
WORKDIR /app
ADD . /app/
RUN npm ci
RUN npm run build
EXPOSE 80
EXPOSE 443
CMD ["node", ".output/server/index.mjs"]
