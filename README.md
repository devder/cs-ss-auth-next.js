# Stack

**Backend**: Node.js, Typescript, MongoDB

**Frontend**: Next.js, Typescript

**DevOps**: Docker, Kubernetes,

# Usage

**Requirements**: Docker, Docker Compose, Yarn, NPM, Node.js

**Setup**

- `make setup`
- Create GitHub OAuth app [here](https://github.com/settings/developers)
  - Set "Homepage URL" to `http://localhost:3000`
  - Set "Authorization callback URL" to `http://localhost:3000/github`
  - Set `GITHUB_CLIENT_ID` in [`.env.development`](.env.development)
  - Set `NEXT_PUBLIC_GITHUB_CLIENT_ID` in [`client/.env.development`](client/.env.development)
  - "Generate a new client secret"
  - Set `GITHUB_CLIENT_SECRET` in [`.env.development`](.env.development)

**Development**

- `make client` (Start Next.js development server, http://localhost:3000)
- `make backend` (Start api and realtime development backend services)

# Codebase

**Services**

- [`client`](client) **Next.js client** (web application)
- [`api`](api) **Node.js server** (http api)
- [`realtime`](realtime) **Node.js server** (websocket server)
- [`shared`](shared) **Typescript lib** (shared code)

# Deployment

**Commands**

- `make deploy` (Build and deploy services to Kubernetes cluster)
- `make destroy` (Destroy cloud resources)
- `make client-image` (Build and push client Docker image)
- `make api-image` (Build and push api Docker image)
- `make realtime-image` (Build and push Docker image)
