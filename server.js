'use strict';

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND = process.env.JITSI_BACKEND || 'https://alpha.jitsi.net';
const backendHost = new URL(BACKEND).host;

// Paths that must be proxied to the Jitsi backend
const PROXY_PATHS = [
    '/http-bind',
    '/xmpp-websocket',
    '/colibri-ws',
    '/about',
    '/v1',
    '/_unlock',
    '/room-size',
    '/speakerstats',
    '/end-conference',
    '/rooms',
    '/jigasi',
    '/transcriptions'
];

const proxy = createProxyMiddleware({
    target: BACKEND,
    changeOrigin: true,
    ws: true,
    logLevel: 'warn',
    headers: {
        Host: backendHost,
        Referer: BACKEND,
        Origin: BACKEND
    },
    on: {
        error: (err, req, res) => {
            console.warn(`Proxy error for ${req.url}:`, err.message);
            if (res && !res.headersSent) {
                res.status(502).json({ error: 'Backend unavailable' });
            }
        }
    }
});

// Apply proxy to backend paths
app.use(PROXY_PATHS, proxy);

// Also proxy *.jitsi.net paths
app.use((req, res, next) => {
    if (req.path.startsWith('/static/') && req.path.includes('jitsi')) {
        return proxy(req, res, next);
    }
    next();
});

// Serve static files (CSS / images / sounds / fonts / lang)
app.use(express.static(path.join(__dirname, '.'), {
    index: false,
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        // No cache for config files so they can be updated
        if (filePath.endsWith('config.js') || filePath.endsWith('interface_config.js')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// All routes → index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start HTTP server with WebSocket upgrade support
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Interr running on http://localhost:${PORT}`);
    console.log(`   Backend: ${BACKEND}\n`);
});

// Handle WebSocket upgrades for colibri and xmpp
server.on('upgrade', proxy.upgrade);
