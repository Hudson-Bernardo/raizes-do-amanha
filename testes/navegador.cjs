// Executar com o servidor ativo: node testes/navegador.cjs.
// Requer Playwright para testes, sem alterar as dependências da aplicação.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.ONG_CHROMIUM_EXECUTABLE || undefined, args: ['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const erros = []; page.on('pageerror', e => erros.push(e.message));
  const base = 'http://127.0.0.1:8000/html/index.html';
  const capturas = path.resolve(__dirname,'../capturas'); fs.mkdirSync(capturas,{recursive:true});
  const esperar = async rota => { await page.waitForURL(url => url.hash === '#/' + rota); await page.waitForFunction(()=>!document.querySelector('#enviar') || !document.querySelector('#enviar').disabled); };
  await page.goto(base); await esperar('inicio');
  const inicioTempo = await page.evaluate(()=>performance.timeOrigin);
  await page.screenshot({path:path.join(capturas,'01-inicio-desktop.png'),fullPage:true});
  await page.locator('#botao-projetos').click();
  assert.equal(await page.locator('#submenu').isVisible(),true);
  await page.locator('#submenu a').first().click(); await esperar('projetos');
  await page.waitForSelector('.badge');
  assert.equal(await page.evaluate(()=>performance.timeOrigin),inicioTempo,'Navegação não deve recarregar o documento.');
  await page.screenshot({path:path.join(capturas,'02-projetos-badges.png'),fullPage:true});
  await page.goBack(); await esperar('inicio');
  await page.goForward(); await esperar('projetos');
  await page.locator('.projeto a').first().click(); await esperar('cadastro?projeto=educacao');
  assert.equal(await page.locator('#projeto').inputValue(),'educacao');
  await page.locator('#cpf').fill('11111111111'); await page.locator('#telefone').focus();
  assert.equal(await page.locator('#cpf').getAttribute('aria-invalid'),'true');
  await page.locator('#formulario-cadastro').screenshot({path:path.join(capturas,'03-erro-formulario.png')});
  for (const [id,value] of Object.entries({nome:'Pessoa de Teste',email:'teste@example.com',nascimento:'2000-01-01',cpf:'52998224725',telefone:'11987654321',cep:'01001000',logradouro:'Rua Exemplo',numero:'123',bairro:'Centro',cidade:'São Paulo',mensagem:'Apoiar oficinas'})) await page.locator('#'+id).fill(value);
  await page.locator('#estado').selectOption('SP'); await page.locator('#disponibilidade').selectOption('semana'); await page.locator('#ciencia').check();
  assert.equal(await page.locator('#cpf').inputValue(),'529.982.247-25');
  assert.equal(await page.locator('#telefone').inputValue(),'(11) 98765-4321');
  assert.equal(await page.locator('#cep').inputValue(),'01001-000');
  await page.locator('#enviar').click();
  await page.waitForFunction(()=>document.querySelector('#resultado').textContent.includes('salvo neste navegador')); 
  await page.screenshot({path:path.join(capturas,'04-sucesso-toast.png'),fullPage:true});
  const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('raizes-amanha:cadastro:v1')));
  assert.equal(salvo.nome,'Pessoa de Teste'); assert.equal('cpf' in salvo,false);
  await page.reload(); await esperar('cadastro?projeto=educacao');
  await page.locator('#recuperar').click(); assert.equal(await page.locator('#nome').inputValue(),'Pessoa de Teste'); assert.equal(await page.locator('#cpf').inputValue(),'');
  await page.locator('#excluir').click(); await page.waitForSelector('dialog[open]');
  await page.screenshot({path:path.join(capturas,'05-modal-exclusao.png')});
  await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog').isVisible(),false);
  assert(await page.evaluate(()=>localStorage.getItem('raizes-amanha:cadastro:v1')));
  await page.locator('#excluir').click(); await page.locator('dialog [value=confirmar]').click();
  await page.waitForFunction(()=>localStorage.getItem('raizes-amanha:cadastro:v1')===null);
  // Armazenamento manipulado não é executado como HTML.
  await page.evaluate(()=>localStorage.setItem('raizes-amanha:cadastro:v1','{'));
  await page.reload(); await esperar('cadastro?projeto=educacao');
  assert.match(await page.locator('#resumo-salvo').innerText(),/corrompido/);
  await page.evaluate(()=>localStorage.removeItem('raizes-amanha:cadastro:v1'));
  await page.goto(base+'#/desconhecida'); await page.waitForSelector('h1'); assert.match(await page.locator('h1').innerText(),/não encontrada/);
  // Bordas dos cinco breakpoints e um celular estreito: nenhuma rolagem horizontal.
  for (const width of [360,479,480,639,640,767,768,1023,1024,1279,1280,1440]) {
    await page.setViewportSize({width,height:900});
    for (const rota of ['inicio','projetos','cadastro']) {
      await page.goto(base+'#/'+rota); await esperar(rota); await page.waitForSelector('h1');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${rota}`);
      assert(await page.locator('img').evaluateAll(imgs=>imgs.every(im=>im.complete && im.naturalWidth>0)),`Imagens ${rota}`);
    }
  }
  await page.setViewportSize({width:390,height:844}); await page.goto(base+'#/inicio'); await esperar('inicio');
  await page.locator('.menu-toggle').click(); assert.equal(await page.locator('#navegacao').isVisible(),true);
  await page.locator('#botao-projetos').click();
  await page.screenshot({path:path.join(capturas,'06-menu-mobile.png'),fullPage:true});
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#submenu').isVisible(),false);
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#navegacao').isVisible(),false);
  assert.deepEqual(erros,[]);
  const texto='APROVADO: navegação sem recarga; voltar/avançar; seleção do projeto; erro e máscara do CPF; envio válido; persistência após recarga; recuperação parcial; modal com Escape e confirmação; exclusão; JSON corrompido; rota inexistente; imagens; 36 verificações de largura; menu mobile; ausência de erros JavaScript.\n';
  fs.writeFileSync(path.resolve(__dirname,'../documentacao/TESTES-NAVEGADOR.txt'),texto);
  console.log(texto); await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
