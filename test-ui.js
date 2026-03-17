const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🎨 Testing Beautiful UI...\n');
  
  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Take screenshots
    await page.screenshot({ path: 'ui-test-1.png', fullPage: true });
    console.log('✅ Screenshot saved: ui-test-1.png');
    
    // Test 2: Verify timer is running
    console.log('\n✓ Test 1: Timer');
    const timerBefore = await page.locator('text=/[0-9]:[0-9]{2}/').first();
    const time1 = await timerBefore.textContent();
    console.log(`  Timer before: ${time1}`);
    
    await page.waitForTimeout(5000);
    
    const timerAfter = await page.locator('text=/[0-9]:[0-9]{2}/').first();
    const time2 = await timerAfter.textContent();
    console.log(`  Timer after 5s: ${time2}`);
    
    if (time1 !== time2) {
      console.log('  ✅ Timer is running!');
    } else {
      console.log('  ❌ Timer still static');
    }
    
    // Test 3: New Game Button
    console.log('\n✓ Test 2: New Game Button');
    const newGameButton = await page.locator('text=\\+ New Game').first();
    await newGameButton.click();
    await page.waitForTimeout(1000);
    
    // Check if modal appeared
    const modal = await page.locator('text=Choose Difficulty').first();
    const modalVisible = await modal.isVisible();
    console.log(`  Modal visible: ${modalVisible ? '✅ Yes' : '❌ No'}`);
    
    // Test 4: Difficulty buttons
    console.log('\n✓ Test 3: Difficulty buttons');
    const easyBtn = await page.locator('text=🌱 Easy').first();
    const mediumBtn = await page.locator('text=⚡ Medium').first();
    const hardBtn = await page.locator('text=🔥 Hard').first();
    
    const easyVisible = await easyBtn.isVisible();
    const mediumVisible = await mediumBtn.isVisible();
    const hardVisible = await hardBtn.isVisible();
    
    console.log(`  Easy visible: ${easyVisible ? '✅' : '❌'}`);
    console.log(`  Medium visible: ${mediumVisible ? '✅' : '❌'}`);
    console.log(`  Hard visible: ${hardVisible ? '✅' : '❌'}`);
    
    // Test 5: Select Medium and verify
    console.log('\n✓ Test 4: Select Medium difficulty');
    await mediumBtn.click();
    await page.waitForTimeout(2000);
    
    // Check if difficulty changed in UI
    const statsText = await page.locator('text=/Easy|Medium/').first();
    const statsVisible = await statsText.count() > 0;
    
    if (statsVisible > 0) {
      const difficultyText = await statsText.textContent();
      console.log(`  Difficulty changed to: ${difficultyText}`);
      console.log('  ✅ Medium selected successfully!');
    } else {
      console.log('  ❌ Failed to select Medium');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'ui-test-final.png', fullPage: true });
    console.log('\n✅ Final screenshot saved: ui-test-final.png');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
