const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 3000;

const urlDatabase = {};

app.use(cors());
app.use(bodyParser.json());

app.post('/shorten-url', (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(6);
  const shortenedUrl = `http://localhost:${PORT}/${shortId}`;
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  urlDatabase[shortId] = { originalUrl, expiryDate };

  res.json({ shortenedUrl, expiryDate });
});

app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const record = urlDatabase[shortId];

  if (record && new Date(record.expiryDate) > new Date()) {
    res.redirect(record.originalUrl);
  } else {
    res.status(404).send('Link not found or expired');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
