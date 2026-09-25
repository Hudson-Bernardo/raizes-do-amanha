// Com o servidor Python ativo: node testes/contraste.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.ONG_CHROMIUM_EXECUTABLE || undefined, args:['--no-sandbox']});
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    const url='http://127.0.0.1:8000/html/index.html';
    await page.goto(url);
    const button=page.locator('#alternar-contraste');
    await button.waitFor({state:'visible'});
    assert.equal(await button.getAttribute('aria-pressed'),'false');
    await button.focus(); await page.keyboard.press('Enter');
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(0, 0, 0)');
    assert.equal(await page.evaluate(()=>getComputedStyle(document.body).color),'rgb(255, 255, 255)');
    for(const route of ['projetos','cadastro','inicio']) {
      await page.evaluate(route=>location.hash='#/'+route,route);
      await page.waitForFunction(route=>location.hash==='#/'+route,route);
      assert.equal(await button.getAttribute('aria-pressed'),'true');
    }
    await page.reload(); await button.waitFor({state:'visible'});
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    const second=await context.newPage(); await second.goto(url);
    await second.locator('#alternar-contraste').waitFor({state:'visible'});
    await button.focus(); await page.keyboard.press('Space');
    await second.waitForFunction(()=>document.querySelector('#alternar-contraste').getAttribute('aria-pressed')==='false');
    for(const width of [360,768,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    const blocked=await browser.newContext();
    await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('bloqueado');}}));
    const third=await blocked.newPage(); await third.goto(url);
    await third.locator('#alternar-contraste').click();
    assert.equal(await third.locator('#alternar-contraste').getAttribute('aria-pressed'),'true');
    assert.deepEqual(errors,[]);
    console.log('PASS: teclado, cores, rotas, recarga, sincronização, larguras e armazenamento bloqueado.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
