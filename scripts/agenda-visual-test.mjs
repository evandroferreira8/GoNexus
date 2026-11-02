import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

fs.mkdirSync('/tmp/agenda-visual', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const failures = [];

async function check(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width <= 720, hasTouch: width <= 720 });
  const page = await context.newPage();
  const jsErrors = [];
  page.on('pageerror', error => jsErrors.push(error.message));
  try {
    await page.goto('http://127.0.0.1:8765/agenda.html', { waitUntil: 'domcontentloaded' });
    await page.locator('#agMEvents .ag-m-card').first().waitFor({ state: 'attached', timeout: 12000 });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => Math.round(document.documentElement.scrollWidth - window.innerWidth));
    assert.ok(overflow <= 2, width + 'px: horizontal overflow of ' + overflow + 'px');
    assert.deepEqual(jsErrors, [], 'Page JavaScript errors');

    if (width <= 720) {
      assert.equal(await page.locator('#agMobile').isVisible(), true, 'Mobile app visible');
      assert.equal(await page.locator('.ag-month-panel').isVisible(), false, 'Desktop month hidden on mobile');
      assert.equal(await page.locator('#agMWeekStrip button').count(), 7, 'Seven day buttons');
      assert.equal(await page.locator('#agMTabWeek').getAttribute('aria-selected'), 'true', 'Week is default');
      await page.screenshot({ path: '/tmp/agenda-visual/mobile-' + width + '-week.png', fullPage: false });

      await page.locator('#agMTabMonth').click();
      assert.equal(await page.locator('#agMMonthPanel').isVisible(), true);
      assert.equal(await page.locator('#agMMonthGrid button').count(), 30);
      await page.locator('#agMMonthGrid [data-m-month="2026-11-21"]').click();
      await assert.match(await page.locator('#agMEvents').innerText(), /Pawniard/);
      await assert.match(await page.locator('#agMEvents').innerText(), /Setor (?:2|II)/);
      await page.screenshot({ path: '/tmp/agenda-visual/mobile-' + width + '-month.png', fullPage: false });

      await page.locator('#agMTabWeek').click();
      assert.equal(await page.locator('#agMWeekPanel').isVisible(), true);
      await page.locator('#agMWeekStrip [data-m-day="2026-11-18"]').click();
      await assert.match(await page.locator('#agMEvents').innerText(), /Hora Lendária/);
    } else {
      assert.equal(await page.locator('#agMobile').isVisible(), false, 'Mobile module hidden on desktop');
      assert.equal(await page.locator('.ag-month-panel').isVisible(), true);
      const badChips = await page.locator('.ag-day-chip').evaluateAll(chips => chips.filter(chip => {
        const cell = chip.closest('button').getBoundingClientRect();
        const label = chip.getBoundingClientRect();
        return label.left < cell.left - 1 || label.right > cell.right + 1 || label.bottom > cell.bottom + 1;
      }).map(e => e.textContent));
      assert.deepEqual(badChips, [], 'Month labels must fit inside calendar cells');
      await page.screenshot({ path: '/tmp/agenda-visual/desktop-' + width + '.png', fullPage: false });
    }
  } catch (error) {
    failures.push(width + 'px: ' + error.message);
    await page.screenshot({ path: '/tmp/agenda-visual/FAILED-' + width + '.png', fullPage: true }).catch(() => {});
  } finally { await context.close(); }
}
try {
  for (const [w,h] of [[360,780],[390,844],[430,900],[720,900],[901,900],[1280,900]]) await check(w,h);
} finally { await browser.close(); }
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log('OK — agenda responsiva em 6 resoluções; sem overflow e com navegação funcional.');
