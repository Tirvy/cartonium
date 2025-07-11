# Cartonis - a site for your boardgame club to organize games and events

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Supabase Login

```bash
npx supabase login
```

## Supabase Login

Copy .env.dist as .env
Fill out all fields in .env

## Supabase autotypes (login requiered)

```bash
sh execs/supabase-type.sh
```

## Development Server

Start the development server on `http://localhost:3000`:

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