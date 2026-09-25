import test from 'node:test';
import assert from 'node:assert/strict';
import { listaProjetos, renderizarCartoes } from '../js/modules/projetos.js';
import { obterTemplate } from '../js/modules/templates.js';

test('a rota de projetos contém os três cartões e seus links de cadastro', () => {
  const html = obterTemplate('projetos');
  assert.equal((html.match(/class="cartao projeto"/g) || []).length, 3);
  for (const projeto of listaProjetos) {
    assert.ok(html.includes(projeto.titulo));
    assert.ok(html.includes(`href="#/cadastro?projeto=${projeto.id}"`));
    assert.ok(html.includes(`alt="${projeto.alt}"`));
  }
});

test('o renderizador aceita uma nova iniciativa sem duplicar o modelo HTML', () => {
  const extra = { ...listaProjetos[0], id: 'novo', titulo: 'Nova iniciativa' };
  const html = renderizarCartoes([...listaProjetos, extra]);
  assert.equal((html.match(/class="cartao projeto"/g) || []).length, 4);
  assert.ok(html.includes('Nova iniciativa'));
  assert.ok(html.includes('#/cadastro?projeto=novo'));
  assert.equal(renderizarCartoes([]), '');
});

test('textos com marcação são escapados e não criam elementos HTML', () => {
  const html = renderizarCartoes([{ ...listaProjetos[0], titulo: '<script>alert(1)</script>', alt: '" onerror="alert(1)' }]);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('alt="&quot; onerror=&quot;alert(1)"'));
});
