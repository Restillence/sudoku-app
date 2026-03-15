const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new", 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. Attempting to find New Game button...');
  
  // Try to find the button by text content
  const buttons = await page.$$('div[role="button"], div[style*="cursor: pointer"]');
  let found = false;
  
  for (const button of buttons) {
    const text = await page.evaluate(el => el.innerText, button);
    if (text && text.includes('New Game')) {
      console.log('Found button:', text);
      await button.click();
      found = true;
      break;
    }
  }

  if (!found) {
    console.log('❌ Could not find New Game button');
  } else {
    console.log('✅ Clicked New Game button');
  }

  await browser.close();
})();
