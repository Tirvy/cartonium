# Cartonium production image (Nuxt/Nitro + local Postgres via DATABASE_URL)
FROM node:20-alpine AS build

ARG GOOGLE_CREDS_URL=
ARG NITRO_PORT=80
ARG PORT=80

WORKDIR /app

COPY package.json package-lock.json ./
RUN NODE_OPTIONS=--max_old_space_size=950 npm ci --legacy-peer-deps

# Optional Google Sheets creds for legacy bots
RUN if [ -n "$GOOGLE_CREDS_URL" ]; then \
      apk add --no-cache wget && \
      wget -O creds.json "$(echo "$GOOGLE_CREDS_URL" | tr -d "'")" ; \
    else \
      echo '{}' > creds.json ; \
    fi

COPY . .

RUN NODE_OPTIONS=--max-old-space-size=950 npm run build

FROM node:20-alpine AS runner

ARG NITRO_PORT=80
ARG PORT=80

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=$PORT
ENV NITRO_PORT=$NITRO_PORT
ENV GAMEBOX_PICS_DIR=/data/gamebox-pics

RUN apk add --no-cache wget

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output
COPY --from=build /app/server/db ./server/db
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/creds.json ./creds.json
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && mkdir -p /data/gamebox-pics

EXPOSE ${NITRO_PORT}

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
