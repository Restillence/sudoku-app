const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🧪 Detaillierte Button-Tests\n');
  
  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Test 1: Difficulty Buttons finden und testen
    console.log('✓ Test 1: Schwierigkeitsstufen');
    console.log('  Suche nach Easy/Medium/Hard Buttons...\n');
    
    // Versuche verschiedene Selektoren
    const easyButton = await page.locator('text=Easy').first();
    const mediumButton = await page.locator('text=Medium').first();
    const hardButton = await page.locator('text=Hard').first();
    
    console.log(`  Easy Button: ${(await easyButton.count()) > 0 ? '✅ gefunden' : '❌ nicht gefunden'}`);
    console.log(`  Medium Button: ${(await mediumButton.count()) > 0 ? '✅ gefunden' : '❌ nicht gefunden'}`);
    console.log(`  Hard Button: ${(await hardButton.count()) > 0 ? '✅ gefunden' : '❌ nicht gefunden'}`);
    
    // Test 2: New Game Button
    console.log('\n✓ Test 2: New Game Button');
    const newGameButton = await page.locator('text=/New Game|New|Restart/i').first();
    const newGameCount = await newGameButton.count();
    
    if (newGameCount > 0) {
      console.log('  ✅ New Game Button gefunden');
      
      // Screenshot VOR dem Klick
      await page.screenshot({ path: 'before-newgame.png' });
      
      // Klick simulieren
      console.log('  Klicke auf New Game...');
      await newGameButton.click();
      await page.waitForTimeout(2000);
      
      // Prüfe ob sich was geändert hat (Alert oder Dialog)
      const hasDialog = await page.locator('[role="dialog"]').count() > 0;
      const hasAlert = await page.locator('[role="alert"]').count() > 0;
      
      console.log(`  Dialog erschienen: ${hasDialog ? '✅ Ja' : '⚠️  Nein'}`);
      console.log(`  Alert erschienen: ${hasAlert ? '✅ Ja' : '⚠️  Nein'}`);
      
      // Screenshot NACH dem Klick
      await page.screenshot({ path: 'after-newgame.png' });
      console.log('  ✅ Screenshots: before-newgame.png / after-newgame.png');
      
      // Falls Alert, versuche "Easy" zu klicken
      if (hasDialog || hasAlert) {
        console.log('\n  Versuche "Easy" im Dialog zu klicken...');
        const easyInDialog = await page.locator('text=Easy').first();
        if (await easyInDialog.count() > 0) {
          await easyInDialog.click();
          await page.waitForTimeout(1000);
          console.log('  ✅ "Easy" ausgewählt - Neues Spiel gestartet!');
        }
      }
    } else {
      console.log('  ❌ New Game Button nicht gefunden');
    }
    
    // Test 3: Notes Button
    console.log('\n✓ Test 3: Notes Button');
    const notesButton = await page.locator('text=/Notes|Note|✏️/i').first();
    const notesCount = await notesButton.count();
    
    if (notesCount > 0) {
      console.log('  ✅ Notes Button gefunden');
      
      // Screenshot VOR dem Klick
      await page.screenshot({ path: 'before-notes.png' });
      
      console.log('  Klicke auf Notes...');
      await notesButton.click();
      await page.waitForTimeout(1000);
      
      // Screenshot NACH dem Klick
      await page.screenshot({ path: 'after-notes.png' });
      console.log('  ✅ Screenshots: before-notes.png / after-notes.png');
      
      // Prüfe ob sich der Button-Status geändert hat
      const notesButtonAfter = await page.locator('text=/Notes|Note|✏️/i').first();
      const text = await notesButtonAfter.textContent();
      console.log(`  Button-Text nach Klick: "${text}"`);
      
      // Zweiter Klick zum Deaktivieren
      console.log('  Klicke erneut auf Notes (zum Deaktivieren)...');
      await notesButtonAfter.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'after-notes-off.png' });
      console.log('  ✅ Notes-Modus deaktiviert');
      
    } else {
      console.log('  ❌ Notes Button nicht gefunden');
    }
    
    // Test 4: Timer läuft?
    console.log('\n✓ Test 4: Timer-Funktionalität');
    const timer1 = await page.locator('text=/[0-9]+:[0-9]{2}/').first();
    const time1 = await timer1.textContent().catch(() => 'nicht gefunden');
    console.log(`  Zeit 1: ${time1}`);
    
    await page.waitForTimeout(3000);
    
    const timer2 = await page.locator('text=/[0-9]+:[0-9]{2}/').first();
    const time2 = await timer2.textContent().catch(() => 'nicht gefunden');
    console.log(`  Zeit 2 (nach 3s): ${time2}`);
    
    if (time1 !== time2) {
      console.log('  ✅ Timer läuft! Zeit ändert sich.');
    } else {
      console.log('  ⚠️  Timer scheint statisch zu sein');
    }
    
    // Finale Screenshot
    await page.screenshot({ path: 'final-test.png', fullPage: true });
    
    console.log('\n✅ Alle Button-Tests abgeschlossen!');
    
  } catch (error) {
    console.error('\n❌ Fehler:', error.message);
  } finally {
    await browser.close();
  }
})();
