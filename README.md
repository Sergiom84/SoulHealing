# SoulHealing

This project contains a small Express server that serves both API routes and the built client.

## Running the server

Install dependencies first:

```bash
npm install
```

Then start the server with Node (for example using `ts-node` during development):

```bash
node server/index.ts
```

The server listens on `process.env.PORT` (default `5000`) and binds to `process.env.HOST` (default `0.0.0.0`). Set these variables if you need a different host or port.

Example:

```bash
HOST=0.0.0.0 PORT=5000 node server/index.ts
```

Your Android application should connect to `http://<server-ip-address>:5000` (replace with the IP of the machine running the server).
