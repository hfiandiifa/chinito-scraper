const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/get-links', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://chinito.ir/shop/', { waitUntil: 'networkidle2' });
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a.product-image-link'))
           .map(el => el.href)
    );
    await browser.close();
    res.json({ success: true, links });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
