# Cartonis - a site for your boardgame club to organize games and events

AI / contributor docs: [AGENTS.md](AGENTS.md) · [CODE_MAP.md](CODE_MAP.md) · [docs/](docs/) · env: [docs/env.md](docs/env.md)

## Setup

```bash
npm install
cp .env.dist .env   # fill DATABASE_URL + BETTER_AUTH_* + Telegram secrets — see docs/env.md
npm run db:up       # local Postgres via Docker Compose
npm run db:migrate  # apply Drizzle schema (domain + Better Auth tables)
```

Auth is **Better Auth** (email/password + Telegram). Domain data and auth tables live in local Postgres. Gamebox images are stored under `public/gamebox-pics/`.

## Development Server

Start the development server on `http://localhost:80` (`nuxt.config.ts` binds port 80 for Telegram Login; use admin privileges on Windows if needed):

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

node .output/server/index.mjs

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

docker build . -t cartonis -f Dockerfile
docker run -p 80:80 --env-file .env -d cartonis

# build Docker localy (mac)
sh execs/docker-builder.sh

# i18n
Translations use nuxt-translation-manager. To edit/add translations edit file "i18n/locales/translations.csv". Im using vscode extension to do it easier.

To use translation texts in pages use 
```
{{ $t('greet.hello_world')}}

```javascript

And remember! If you use translations inside <script> - make them computable so they change when user switches locale.