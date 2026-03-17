const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🧪 Sudoku App Testing...\n');
  
  try {
    // Test 1: App laden
    console.log('✓ Test 1: App laden...');
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    console.log('  ✅ App erfolgreich geladen');
    
    // Test 2: Screenshot erstellen
    console.log('\n✓ Test 2: Screenshot erstellen...');
    await page.screenshot({ path: 'test-screenshot-1.png', fullPage: true });
    console.log('  ✅ Screenshot gespeichert: test-screenshot-1.png');
    
    // Test 3: Spielfeld vorhanden?
    console.log('\n✓ Test 3: Spielfeld prüfen...');
    const grid = await page.$('[data-testid="sudoku-grid"]') || await page.$('.sudoku-grid') || await page.$('table');
    if (grid) {
      console.log('  ✅ Spielfeld gefunden');
    } else {
      console.log('  ⚠️  Kein Spielfeld gefunden (möglicherweise andere Struktur)');
    }
    
    // Test 4: Zellen anklicken
    console.log('\n✓ Test 4: Zellen anklicken...');
    const cells = await page.$$('input[type="text"], [contenteditable="true"], .cell, td');
    if (cells.length > 0) {
      console.log(`  ✅ ${cells.length} Zellen gefunden`);
      await cells[0].click();
      console.log('  ✅ Erste Zelle angeklickt');
    } else {
      console.log('  ⚠️  Keine Zellen gefunden');
    }
    
    // Test 5: Zahlen eingeben
    console.log('\n✓ Test 5: Zahlen eingeben...');
    if (cells.length > 0) {
      await cells[0].click();
      await page.keyboard.type('5');
      console.log('  ✅ Zahl "5" in erste Zelle eingegeben');
      await page.waitForTimeout(500);
    }
    
    // Test 6: Timer prüfen
    console.log('\n✓ Test 6: Timer prüfen...');
    const timer = await page.$('.timer, [data-testid="timer"], time');
    if (timer) {
      const timerText = await timer.textContent();
      console.log(`  ✅ Timer gefunden: ${timerText}`);
    } else {
      console.log('  ⚠️  Kein Timer gefunden');
    }
    
    // Test 7: Schwierigkeitsstufen
    console.log('\n✓ Test 7: Schwierigkeitsstufen prüfen...');
    const difficultyButtons = await page.$$('button:has-text("Easy"), button:has-text("Medium"), button:has-text("Hard")');
    if (difficultyButtons.length > 0) {
      console.log(`  ✅ ${difficultyButtons.length} Schwierigkeitsstufen gefunden`);
      
      // Klicke auf "Medium"
      const mediumButton = await page.$('button:has-text("Medium")');
      if (mediumButton) {
        await mediumButton.click();
        console.log('  ✅ Schwierigkeit "Medium" ausgewählt');
        await page.waitForTimeout(1000);
      }
    } else {
      console.log('  ⚠️  Keine Schwierigkeitsbuttons gefunden');
    }
    
    // Test 8: Neue Spiel starten
    console.log('\n✓ Test 8: Neues Spiel starten...');
    const newGameButton = await page.$('button:has-text("New"), button:has-text("New Game"), button:has-text("Restart")');
    if (newGameButton) {
      await newGameButton.click();
      console.log('  ✅ Neues Spiel gestartet');
      await page.waitForTimeout(1000);
    } else {
      console.log('  ⚠️  Kein "Neues Spiel" Button gefunden');
    }
    
    // Test 9: Zweiter Screenshot
    console.log('\n✓ Test 9: Zweiter Screenshot...');
    await page.screenshot({ path: 'test-screenshot-2.png', fullPage: true });
    console.log('  ✅ Zweiter Screenshot gespeichert: test-screenshot-2.png');
    
    console.log('\n✅ Alle Tests abgeschlossen!');
    
  } catch (error) {
    console.error('\n❌ Fehler beim Testen:', error.message);
  } finally {
    await browser.close();
  }
})();
