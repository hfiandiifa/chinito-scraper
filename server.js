const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 10000;


app.get('/get-links', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ success: false, message: "Missing 'url' query parameter" });
    }

    const response = await axios.get(targetUrl);
    const $ = cheerio.load(response.data);

    let links = new Set();
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.add(href);
      }
    });

    res.json({ success: true, links: Array.from(links) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
