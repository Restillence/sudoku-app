const puppeteer = require('puppeteer');

const { exec } = require('puppeteer');

const { test, describe, beforeAll, beforeEach, */
 => {
  let browser;
  let page;
  let failures = [];
  
  before(async () => {
    // Start the web server
    await new Promise(resolve => {
      server = await new Promise(resolve);
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox-networking']
      });
      
      // Wait for server to be ready
      try {
        await page.goto('http://localhost:8081');
      } catch (err) {
        if (retry > 0) {
          await new Promise(resolve => {
            console.log('Server still not ready after 10s');
            throw new Error(`Server not ready after ${10}s: ${err.message}`);
          }
        }
        failures.push({
          test: 'Server startup',
          status: 'failed',
          error: err.message
        });
      } finally {
        await browser.close();
      }
      
      console.log('\n❌ Test Results:');
      failures.forEach(f => {
        console.log(`  - ${f.test}: ${f.error}`);
      });
    }
  } catch (err) {
    console.log(err);
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`- Total tests: ${failures.length}`);
    console.log(`- Failed tests: ${failures.map(f => f.test). f.error).f.join('\ | '));
    failures.forEach(f => {
      console.log(`  - ${f.test}`);
      console.log(`    Status: ${f.status}`);
      console.log(`    Error: ${f.error}`);
    });
  }
});
