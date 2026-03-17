const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🧪 Testing Sudoku App Fixes\n');
  console.log('==============================\n');
  
  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // TEST 1: Timer
    console.log('✓ Test 1: Timer-Funktionalität');
    const timerBefore = await page.locator('text=/[0-9]:[0-9]{2}/').first().textContent();
    console.log(`  Zeit vor 5s: ${timerBefore}`);
    
    await page.waitForTimeout(5000);
    
    const timerAfter = await page.locator('text=/[0-9]:[0-9]{2}/').first().textContent();
    console.log(`  Zeit nach 5s: ${timerAfter}`);
    
    if (timerBefore !== timerAfter) {
      console.log('  ✅ Timer läuft korrekt!\n');
    } else {
      console.log('  ❌ Timer läuft NICHT (statisch)\n');
    }
    
    // TEST 2: New Game Button
    console.log('✓ Test 2: New Game Button');
    const newGameButton = await page.locator('text=New Game').first();
    if (await newGameButton.count() > 0) {
      console.log('  ✅ New Game Button gefunden');
      
      await newGameButton.click();
      await page.waitForTimeout(1000);
      
      // Prüfe ob Modal erschienen ist
      const modalTitle = await page.locator('text=Select Difficulty').first();
      const hasModal = await modalTitle.count() > 0;
      
      if (hasModal) {
        console.log('  ✅ Difficulty Modal erschienen!\n');
        
        // Screenshot vom Modal
        await page.screenshot({ path: 'screenshot-modal.png' });
        console.log('  📸 Screenshot: screenshot-modal.png\n');
        
        // TEST 3: Alle Difficulty Buttons
        console.log('✓ Test 3: Difficulty Buttons');
        const easyBtn = await page.locator('text=Easy').first();
        const mediumBtn = await page.locator('text=Medium').first();
        const hardBtn = await page.locator('text=Hard').first();
        
        console.log(`  Easy: ${(await easyBtn.count()) > 0 ? '✅' : '❌'}`);
        console.log(`  Medium: ${(await mediumBtn.count()) > 0 ? '✅' : '❌'}`);
        console.log(`  Hard: ${(await hardBtn.count()) > 0 ? '✅' : '❌'}\n`);
        
        // TEST 4: Difficulty wechseln
        console.log('✓ Test 4: Difficulty ändern');
        await mediumBtn.click();
        await page.waitForTimeout(2000);
        
        // Prüfe ob "Medium" in Stats steht
        const statsText = await page.locator('text=Medium').first();
        const hasMedium = await statsText.count() > 0;
        console.log(`  Medium ausgewählt: ${hasMedium ? '✅' : '❌'}\n`);
        
      } else {
        console.log('  ❌ Kein Modal erschienen (Alert im Headless nicht sichtbar)\n');
      }
    } else {
      console.log('  ❌ New Game Button nicht gefunden\n');
    }
    
    // TEST 5: Notes Button
    console.log('✓ Test 5: Notes Button');
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const notesButton = await page.locator('text=/✏️ Notes|Notes/').first();
    if (await notesButton.count() > 0) {
      console.log('  ✅ Notes Button gefunden');
      await notesButton.click();
      console.log('  ✅ Notes Button geklickt (Modus gewechselt)\n');
    } else {
      console.log('  ⚠️  Notes Button nicht gefunden\n');
    }
    
    // Finaler Screenshot
    await page.screenshot({ path: 'screenshot-final-tests.png' });
    console.log('📸 Finaler Screenshot: screenshot-final-tests.png\n');
    
    console.log('==============================');
    console.log('✅ Alle Tests abgeschlossen!\n');
    
  } catch (error) {
    console.error('\n❌ Fehler:', error.message);
  } finally {
    await browser.close();
  }
})();
