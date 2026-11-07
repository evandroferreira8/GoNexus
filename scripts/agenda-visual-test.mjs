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
      assert.equal(await page.locator('.ag-spotlight-mobile').isVisible(), true, 'Próximo destaque no celular');
      assert.match(await page.locator('.ag-spotlight-mobile').innerText(), /PRÓXIMO DESTAQUE/, 'Card de destaque preenchido');
      const stripBounds=await page.locator('#agMWeekStrip').evaluate(el=>{
        const container=el.getBoundingClientRect(),children=[...el.querySelectorAll('button')].map(x=>x.getBoundingClientRect());
        return {left:Math.min(...children.map(x=>x.left)),right:Math.max(...children.map(x=>x.right)),containerLeft:container.left,containerRight:container.right};
      });
      assert.ok(stripBounds.left>=stripBounds.containerLeft-1 && stripBounds.right<=stripBounds.containerRight+1, 'Sete dias devem caber sem rolagem lateral');
      await page.screenshot({ path: '/tmp/agenda-visual/mobile-' + width + '-week.png', fullPage: false });

      await page.locator('#agMTabMonth').click();
      assert.equal(await page.locator('#agMMonthPanel').isVisible(), true);
      assert.equal(await page.locator('#agMMonthGrid button').count(), 30);
      await page.locator('#agMMonthGrid [data-m-month="2026-11-21"]').click();
      await assert.match(await page.locator('#agMEvents').innerText(), /Pawniard/);
      await assert.match(await page.locator('#agMEvents').innerText(), /Setor (?:2|II)/);
      const cd = await page.locator('#agMEvents').innerText();
      assert.match(cd, /No jogo:\s*14h[–-]17h/, 'Pawniard: mostrar o jogo como horário principal');
      assert.match(cd, /Check-in\s*·\s*13h/, 'Pawniard: mostrar check-in à parte');
      await page.locator('#agMMonthGrid [data-m-month="2026-11-04"]').click();
      const raid = await page.locator('#agMEvents').innerText();
      assert.match(raid, /No jogo:\s*18h[–-]19h/, 'Hora Lendária: jogo 18h–19h');
      assert.match(raid, /Check-in\s*·\s*17h/, 'Hora Lendária: check-in 17h');
      await page.locator('#agMMonthGrid [data-m-month="2026-11-02"]').click();
      const monday = await page.locator('#agMEvents').innerText();
      assert.match(monday, /Bônus de segunda \(dia todo\)/, 'Segunda Max: bônus diários');
      assert.match(monday, /Check-in\s*·\s*17h/, 'Segunda Max: check-in 17h');
      await page.locator('#agMMonthGrid [data-m-month="2026-11-28"]').click();
      assert.match(await page.locator('#agMEvents .ag-m-card').first().innerText(), /Clefable/, 'Evento pontual deve aparecer primeiro');
      assert.match(await page.locator('#agMEvents .ag-m-card').first().innerText(), /CTEC/, 'CTEC visível');
      assert.match(await page.locator('#agMEvents .ag-m-card').first().innerText(), /check-in no Campfire a confirmar/, 'Diferença entre local e check-in');
      await page.locator('#agMMonthGrid [data-m-month="2026-11-21"]').click();
      await page.screenshot({ path: '/tmp/agenda-visual/mobile-' + width + '-month.png', fullPage: false });

      await page.locator('#agMTabWeek').click();
      assert.equal(await page.locator('#agMWeekPanel').isVisible(), true);
      await page.locator('#agMWeekStrip [data-m-day="2026-11-18"]').click();
      await assert.match(await page.locator('#agMEvents').innerText(), /Hora Lendária/);
    } else {
      assert.equal(await page.locator('#agMobile').isVisible(), false, 'Mobile module hidden on desktop');
      assert.equal(await page.locator('.ag-month-panel').isVisible(), true);
      assert.equal(await page.locator('.ag-spotlight-desktop').isVisible(), true, 'Destaque no desktop');
      const badChips = await page.locator('.ag-day-chip').evaluateAll(chips => chips.filter(chip => {
        const cell = chip.closest('button').getBoundingClientRect();
        const label = chip.getBoundingClientRect();
        return label.left < cell.left - 1 || label.right > cell.right + 1 || label.bottom > cell.bottom + 1;
      }).map(e => e.textContent));
      assert.deepEqual(badChips, [], 'Month labels must fit inside calendar cells');
      await page.locator('#agDays [data-day="2026-11-04"]').click();
      const peek=await page.locator('#agMonthSelected').innerText();
      assert.match(peek, /Jogo:\s*18h[–-]19h/, 'Desktop: horário oficial da Hora Lendária');
      assert.match(peek, /Check-in Campfire\s*·\s*17h/, 'Desktop: check-in distinto do jogo');
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
