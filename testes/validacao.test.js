import test from 'node:test';
import assert from 'node:assert/strict';
import { cpfValido, formatarCPF, formatarTelefone, formatarCEP } from '../js/modules/validacao.js';
test('CPF: aceita verificadores corretos e rejeita alteração, repetição e tamanho incompleto', () => {
  assert.equal(cpfValido('529.982.247-25'), true);
  for (const v of ['52998224724', '11111111111', '', '123']) assert.equal(cpfValido(v), false);
});
test('Máscaras preservam zeros, limitam tamanho e aceitam colagem formatada', () => {
  assert.equal(formatarCPF('529.982.247-25'), '529.982.247-25');
  assert.equal(formatarCEP('01001000999abc'), '01001-000');
  assert.equal(formatarTelefone('11987654321'), '(11) 98765-4321');
  assert.equal(formatarTelefone('1134567890'), '(11) 3456-7890');
  assert.equal(formatarTelefone(''), '');
});
