# Running Madoc locally from source

This guide gets a local Madoc running from **your fork's code**, so that edits you make in this repository show up in the browser.

## Which Docker setup to use

There are two sets of Docker Compose files, and they do different jobs:

| | `madoc/docker-compose.yml` (this repo) | `madoc-config/` |
|---|---|---|
| Purpose | Development | Deployment and trying Madoc out |
| `madoc-ts` | Built from `services/madoc-ts`, with your `src/` mounted in | Pre-built image from `ghcr.io/digirati-co-uk/madoc-api` |
| Frontend | Vite dev server with hot reload | Production bundle baked into the image |
| URL | `https://madoc.local` | `http://localhost:8878` |
| Your code changes | Show up | Don't show up |

**Use the compose file in this repo for development.** It is already wired to load code from your filesystem.

You could change `madoc-config` to build `madoc-ts` from this folder, but you would be rebuilding what this repo's compose file already does, minus hot reload. Keep `madoc-config` for later, when you want to deploy your fork as built images.

## How code reaches the running app

```
your editor
  │
  ├─ services/madoc-ts/src ──mounted──▶ madoc-ts-vite (port 3088)   frontend, hot reload
  │
  └─ services/madoc-ts/dist ─mounted──▶ madoc-ts (PM2: server, auth, queue, scheduler)
        ▲
        └─ built by `pnpm build:vite-*` (you run these)
```

- **Frontend changes** (`src/frontend/**`) reload in the browser on save. The page HTML loads scripts from the Vite server at `https://madoc.local:3088`.
- **Backend changes** (routes, tasks, queue, auth) need the matching bundle rebuilt and the PM2 app restarted (see the table below). The PM2 apps run the bundles in `dist/`, not the TypeScript source.
- **Server-rendered HTML** also comes from the `server` bundle. If you change a component's initial markup and see hydration warnings, rebuild the server bundle too.

## One-time setup

All commands run from the repository root (`madoc/`) unless stated.

### 1. Tools

- **Docker** with Compose v2. Already installed.
- **Node 24** through nvm. Already installed.
- **pnpm 11**, through corepack:

  ```bash
  source ~/.nvm/nvm.sh && nvm use 24
  corepack enable
  pnpm --version   # should print 11.x
  ```

- **mkcert**, for a trusted local HTTPS certificate:

  ```bash
  sudo apt install libnss3-tools mkcert
  mkcert -install          # trusts the local CA in your browsers (restart them afterwards)
  ```

### 2. Hostname

```bash
echo "127.0.0.1 madoc.local" | sudo tee -a /etc/hosts
```

Port 443 must be free on your machine, because the gateway binds to it.

### 3. Local data folders and certificate

```bash
mkdir -p var/certs var/files var/jwt var/shared-database var/typesense var/.vite-cache
bash ./create-certs.sh   # writes var/certs/local-cert.pem and local-key.pem
ls var/certs             # check both .pem files are there
```

The script isn't marked executable in the repository, so run it with `bash`. `var/` is git-ignored. It holds the database, uploaded files and certificates.

### 4. Install dependencies and build the bundles

Do this **before the first `docker compose up`**. The compose file mounts `services/madoc-ts/dist` over the container's own copy. If the folder doesn't exist yet, Docker creates it empty and owned by root, and PM2 has nothing to run.

```bash
pnpm --dir services/madoc-ts install
pnpm --dir services/madoc-ts build:vite
```

The installed `node_modules` also gives your editor type-checking.

### 5. Your own installation code

Madoc asks for an installation passphrase the first time you open it. Choose a passphrase, then turn it into a hash with `bcryptjs` (installed in step 4):

```bash
cd services/madoc-ts
node -e "require('bcryptjs').hash(process.argv[1], 14).then(console.log)" 'your-passphrase-here'
cd ../..
```

It prints one line starting `$2a$14$`. Open `.env` in the repository root, find the existing `MADOC_INSTALLATION_CODE` line and replace its value with your hash, **in single quotes**. The hash contains `$` characters, and Compose would try to expand them inside double quotes.

```
MADOC_INSTALLATION_CODE='$2a$14$...your hash...'
```

Keep the passphrase itself; you type it into the browser in step 7. `.env` is only read when the containers start, so if you change it later, run `docker compose up -d madoc-ts` to apply it.

(`services/madoc-ts/install-code.cjs` does the same job, but it needs the native `bcrypt` package, which isn't installed.) `.env` is tracked in git. Leave this change out of your commits if you don't want it shared.

### 6. Start everything

```bash
docker compose up -d --build
```

The first build takes a while. Then check the processes:

```bash
docker compose ps
docker compose exec madoc-ts pm2 list      # server, auth, queue, scheduler should be "online"
```

### 7. Install Madoc in the browser

1. Open `https://madoc.local`.
2. Enter your passphrase from step 5.
3. Create the admin user and first site.

The site lives at `https://madoc.local/s/<site-slug>/` and the admin at `https://madoc.local/s/<site-slug>/admin`.

## Day-to-day

```bash
docker compose up -d          # start
docker compose stop           # stop, keeping data
docker compose logs -f --tail=200 madoc-ts
docker compose exec madoc-ts pm2 logs server
```

### After changing code

| You changed | Do this |
|---|---|
| `src/frontend/**` | Nothing. Save and the browser updates |
| Server routes, middleware, server rendering | `pnpm --dir services/madoc-ts build:vite-server` then `docker compose exec madoc-ts pm2 restart server` |
| Auth | `pnpm --dir services/madoc-ts build:vite-auth` then `docker compose exec madoc-ts pm2 restart auth` |
| Queue tasks (`src/gateway/tasks`, `src/queue/producer.ts`) | `pnpm --dir services/madoc-ts build:vite-producer` then `docker compose exec madoc-ts pm2 restart queue` |
| Scheduler | `pnpm --dir services/madoc-ts build:vite-scheduler` then `docker compose exec madoc-ts pm2 restart scheduler` |
| A migration in `migrations/` | Rebuild the server bundle and restart `server`. Migrations run on start because `MIGRATE=true` |
| `package.json` dependencies | `pnpm --dir services/madoc-ts install` then `docker compose up -d --build` |

To avoid running builds by hand, `pnpm --dir services/madoc-ts start` watches all four bundles and rebuilds on save. You still restart the PM2 app yourself.

## Getting realistic test data

- **Manifests:** in admin, import IIIF manifests by URL. NLW manifest URLs work directly.
- **Projects and capture models:** export a project template from the live site (admin project page, Export, or `GET /api/madoc/projects/:id/export`). Import it locally when creating a new project, by URL, URN or uploaded JSON. This brings the capture model and project configuration across, but not contributions.
- **Single capture models:** `GET /api/madoc/crowdsourcing/model/:id/json` returns one model as JSON.

A handful of exported templates covering different shapes would make a good test set for the friendly editor: plain transcription, region annotations, many choices, and tabular.

## Troubleshooting

- **Browser warns about the certificate, or the page loads without scripts:** run `mkcert -install` again and restart the browser. Also open `https://madoc.local:3088` once to check that the Vite server answers.
- **PM2 apps stuck in `errored`:** `docker compose exec madoc-ts pm2 logs`. The usual cause is an empty `dist/`, so rebuild with step 4 and restart.
- **`permission denied` writing to `dist/`:** Docker created it as root. Run `sudo chown -R $USER services/madoc-ts/dist` and build again.
- **pnpm says the Node version is unsupported:** run `nvm use 24` in that shell.
- **Start from a clean database:** stop the stack, then delete `var/shared-database`. This erases all local data.
