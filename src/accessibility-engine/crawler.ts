import puppeteer from 'puppeteer';

export async function crawlPage(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const domData = await page.evaluate(() => {
    return {
      images: Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt
      })),
      elements: Array.from(document.querySelectorAll('*')).map(el => ({
        tag: el.tagName,
        text: el.textContent,
        styles: window.getComputedStyle(el),
        hasLabel: el.id && document.querySelector(`label[for="${el.id}"]`)
      }))
    };
  });

  await browser.close();
  return domData;
}
