export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  // App Proxy sends signed requests server-to-server, so no CORS needed here.
  res.status(200).json({ ok: true, via: 'app-proxy', ts: Date.now() });
}
