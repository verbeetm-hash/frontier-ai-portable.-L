import { test, expect } from '@playwright/test';

const signed='https://frontier-nine-assets-shadow-20261015.pages.dev';
const lifecycle='https://frontier-sw-lifecycle-shadow-20261015.pages.dev';

test('signed nine-asset Cloudflare release verifies in Chromium', async ({ page }) => {
  await page.goto(signed, { waitUntil:'domcontentloaded' });
  await page.getByRole('button', {name:'Controleer alle 9 bestanden'}).click();
  await expect(page.locator('#out')).toHaveText('PASS: Ed25519 + 9/9 SHA-256 bestanden', {timeout:180000});
});

test('real service worker A to B, reload, rollback to A', async ({ browser }) => {
  const context=await browser.newContext({serviceWorkers:'allow'});
  const page=await context.newPage();
  await page.goto(lifecycle);
  await page.locator('#a').click();
  await expect(page.locator('#out')).toContainText('PASS: A geïnstalleerd');
  await page.locator('#b').click();
  await expect(page.locator('#out')).toContainText('PASS: B geïnstalleerd');
  await page.reload();
  await page.locator('#restart').click();
  await expect(page.locator('#out')).toContainText('PASS: herstart + Service Worker, versie B');
  await page.locator('#back').click();
  await expect(page.locator('#out')).toContainText('PASS: rollback A');
  await context.close();
});
