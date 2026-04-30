# GitHub Clone (Starter)

A full-stack starter for a GitHub-like platform with Next.js UI, Node.js API, PostgreSQL, and Docker Compose.

## Gitea Git server (required for real repos/commits)

This project reads real repositories and commits from a Gitea server.

1. Start the stack with Docker Compose (includes Gitea).
2. Open Gitea at http://localhost:3001 and finish the initial setup.
3. Create the admin user (use the values in apps/api/.env or docker-compose).
4. Create at least one repository in Gitea so the UI has data.

## Local setup (Docker)

1. Copy env files:
   - apps/api/.env.example -> apps/api/.env
2. Start services:
   - docker compose up --build
3. Run migrations and seed:
   - ./scripts/migrate.sh
   - ./scripts/seed.sh

Open the UI at http://localhost:3000

## Local setup (node)

1. Install dependencies:
   - npm install
2. Configure env:
   - apps/api/.env.example -> apps/api/.env
   - apps/web/.env.example -> apps/web/.env
3. Run migrations and seed:
   - ./scripts/migrate.sh
   - ./scripts/seed.sh
4. Start API and Web:
   - npm run dev:api
   - npm run dev:web

## Azure VM deployment (Docker)

1. Install Docker and Docker Compose on the VM.
2. Copy the repo to the VM.
3. Set a strong JWT_SECRET in docker-compose.yml or via environment overrides.
4. Run:
   - docker compose up -d --build
5. Run migrations and seed:
   - ./scripts/migrate.sh
   - ./scripts/seed.sh

## Notes
- This starter provides a clean base with auth, repos, issues, and pull requests.
- Replace placeholder data and tune access control for production.
