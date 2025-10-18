# CURB CHAT

A modern Slack-like chat application built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Civic](https://www.civic.com/) and [TypeScript](https://www.typescriptlang.org/). It uses [Calimero](https://calimero.network/) as the backend for secure peer-to-peer (P2P) communications.

---

## Features

- Real-time chat experience
- Public and private Groups
- Markdown messages
- Image and file sharing
- P2P communication powered by **Calimero** and **Civic**

---

## Getting Started

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+)

You can install `pnpm` globally if you haven’t already:

```bash
npm install -g pnpm
```

### 2. Installation

```bash
git clone https://github.com/frdomovic/private-chat.git
cd private-chat
pnpm install
```

### 3. Start dev server

```bash
pnpm run dev
> access the app at: http://localhost:5173/
```


### 4. Create new context
```bash
cargo run -p meroctl -- --node node1 context create --application-id 3Hfk2VekXQ58vYHW3hUtA3mh2Rwtb1brV1RKEXtfvfsf --protocol near --params '{"name": "CurbTest","is_dm": false, "default_channels": [{"name": "general"},{"name": "engineering"},
{"name": "marketing"}],"created_at": 1751652997, "owner_username": "FD DOM"}'
```

## Calimero Documentation

For full integration explanation refer to Calimero Network [docs](https://calimero-network.github.io/introduction/what-is-calimero)

