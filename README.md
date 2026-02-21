# <p align="center">Interr</p>

Interr is a secure, high-quality video meeting platform built for the modern web. It empowers users to host and join real-time video conferences with state-of-the-art quality and a rich set of collaboration features.

<hr />

<p align="center">
<img src="readme-img1.png" width="900" />
</p>

<hr />

Amongst others here are the main features Interr offers:

* Support for all current browsers
* Mobile applications (Android & iOS)
* Web and native SDKs for integration
* HD audio and video
* Content sharing
* Raise hand and reactions
* Chat with private conversations
* Polls
* Virtual backgrounds
* End-to-End Encryption (E2EE)
* Noise suppression
* Breakout rooms
* Whiteboard

And many more!

## Using Interr

Using Interr is straightforward — it's fully browser based, no installation required. Just open the app, type a room name, and start your meeting. All major browsers are supported.

## Running your own instance

To run your own Interr instance, clone this repository and follow the setup instructions below.

Requirements:
- Node.js >= 22
- npm >= 10

```bash
npm install
npx webpack serve --mode development
```

The app will be available at `http://localhost:8080`.

## Deploy

### Option 1 — Railway (recommended, full video calls work)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `INTERR_MEET` → Railway auto-reads `railway.toml` and deploys
3. Everything works — video, audio, screenshare. Live URL given by Railway.

### Option 2 — Render (one-click, free tier)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/nick0410/INTERR_MEET)

### Option 3 — Docker (any VPS / cloud)

```bash
docker build -t interr-meet .
docker run -p 3000:3000 interr-meet
```

### Option 4 — Manual (any server)

```bash
npm install
npm run build      # production webpack build
node server.js     # runs on port 3000
```

Set `JITSI_BACKEND` env var to your own Jitsi backend (default: `https://alpha.jitsi.net`).

## Security

Interr implements End-to-End Encryption (E2EE) using the Olm/Megolm cryptographic protocol, ensuring that media is encrypted before it leaves your device.

For information on reporting security vulnerabilities, see [SECURITY.md](./SECURITY.md).

## Contributing

Contributions are welcome! Please see our [guidelines for contributing](CONTRIBUTING.md) before submitting a pull request.

<br />
