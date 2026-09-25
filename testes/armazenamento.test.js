import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAVE, lerRegistro, salvarRegistro, excluirRegistro } from '../js/modules/armazenamento.js';
const dados = { nome: 'Pessoa de Teste', email: 'teste@example.com', projeto: 'educacao', disponibilidade: 'semana', mensagem: 'Apoiar oficinas', cpf: '52998224725' };
function simularStorage() {
  const mapa = new Map();
  globalThis.localStorage = { getItem: k => mapa.get(k) ?? null, setItem: (k,v) => mapa.set(k,v), removeItem: k => mapa.delete(k) };
  return mapa;
}
test('Persiste apenas campos permitidos e exclui sem afetar outras chaves', () => {
  const mapa = simularStorage(); mapa.set('outro-projeto','preservar');
  assert(salvarRegistro(dados).dados);
  assert.equal(lerRegistro().dados.nome, dados.nome);
  assert.equal('cpf' in lerRegistro().dados, false);
  assert(excluirRegistro().ok); assert.equal(lerRegistro().dados, null);
  assert.equal(mapa.get('outro-projeto'),'preservar');
});
test('Dados corrompidos e versões desconhecidas produzem erro recuperável', () => {
  const mapa = simularStorage(); mapa.set(CHAVE,'{'); assert(lerRegistro().erro);
  mapa.set(CHAVE,JSON.stringify({...dados,versao:99})); assert(lerRegistro().erro);
});
test('Bloqueio e falta de espaço não produzem confirmação falsa', () => {
  globalThis.localStorage = { getItem(){throw Error()}, setItem(){throw Error()}, removeItem(){throw Error()} };
  assert(lerRegistro().erro); assert(salvarRegistro(dados).erro); assert(excluirRegistro().erro);
});
