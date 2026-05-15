const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { error: 'Too many auth attempts' }
});

app.post('/test', limiter, (req, res) => {
  res.json({ success: true });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(5002, async () => {
  try {
    const res = await fetch('http://localhost:5002/test', { method: 'POST' });
    const text = await res.text();
    console.log('Response:', text);
    process.exit(0);
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
});
