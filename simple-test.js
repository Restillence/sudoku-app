const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🧪 Simple UI Test\n');
  
  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'sudoku-ui-1.png', fullPage: true });
    console.log('✅ Screenshot 1: sudoku-ui-1.png\n');
    
    // Test if New Game button exists
    const newGameBtn = await page.locator('text=New Game').first();
    const newGameExists = await newGameBtn.count() > 0;
    
    if (newGameExists) {
      console.log('✅ New Game Button gefunden');
      await newGameBtn.click();
      await page.waitForTimeout(1000);
      
      // Check for difficulty buttons
      const easyBtn = await page.locator('text=Easy').first();
      const mediumBtn = await page.locator('text=Medium').first();
      const hardBtn = await page.locator('text=Hard').first();
      
      const hasEasy = await easyBtn.isVisible();
      const hasMedium = await mediumBtn.isVisible();
      const hasHard = await hardBtn.isVisible();
      
      console.log(`✅ Easy: ${hasEasy ? 'sichtbar' : 'nicht gefunden'}`);
      console.log(`✅ Medium: ${hasMedium ? 'sichtbar' : 'nicht gefunden'}`);
      console.log(`✅ Hard: ${hasHard ? 'sichtbar' : 'nicht gefunden'}`);
      
      // Take screenshot of modal
      await page.screenshot({ path: 'sudoku-ui-modal.png', fullPage: true });
      console.log('✅ Screenshot 2: sudoku-ui-modal.png\n');
    } else {
      console.log('❌ New Game Button nicht gefunden');
    }
    
    // Test Notes button
    const notesBtn = await page.locator('text=Notes').first();
    const notesExists = await notesBtn.count() > 0;
    
    if (notesExists) {
      console.log('✅ Notes Button gefunden');
      await notesBtn.click();
      console.log('✅ Notes Button geklickt (Modus gewechselt)');
      await page.screenshot({ path: 'sudoku-ui-notes.png', fullPage: true });
      console.log('✅ Screenshot 3: sudoku-ui-notes.png\n');
    }
    
    // Test Timer is displayed (even if we can't read the text)
    const hasTimer = await page.locator('div[class*="timer"]').count() > 0 || 
                    await page.locator('text=/[0-9]+:[0-9]{2}/').count() > 0;
    
    if (hasTimer) {
      console.log('✅ Timer wird angezeigt');
    } else {
      console.log('⚠️  Timer nicht gefunden');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'sudoku-ui-final.png', fullPage: true });
    console.log('✅ Screenshot 4: sudoku-ui-final.png\n');
    
    console.log('✅ Test abgeschlossen!');
    
  } catch (error) {
    console.error('❌ Test fehlgeschlagen:', error.message);
  } finally {
    await browser.close();
  }
})();
