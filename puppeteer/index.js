const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1400,
      height: 800
    },
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com/');
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();