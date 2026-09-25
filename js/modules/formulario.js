import { formatarCPF, formatarTelefone, formatarCEP, somenteDigitos, validarCampo } from './validacao.js';
import { lerRegistro, salvarRegistro, excluirRegistro } from './armazenamento.js';
import { notificar, confirmarExclusao } from './feedback.js';

export function iniciarFormulario(parametros) {
  const form = document.querySelector('#formulario-cadastro');
  if (!form) return () => {};
  // O AbortController remove todos os eventos desta tela antes de mudar a rota.
  const controle = new AbortController();
  const opcoes = { signal: controle.signal };
  const resultado = document.querySelector('#resultado');
  const campos = [...form.querySelectorAll('input, select, textarea')];
  const mascaras = { cpf: formatarCPF, telefone: formatarTelefone, cep: formatarCEP };
  const hoje = new Date();
  form.elements.nascimento.max = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  form.elements.nascimento.min = '1900-01-01';
  if ([...form.elements.projeto.options].some(o => o.value === parametros.get('projeto'))) form.elements.projeto.value = parametros.get('projeto');

  // Mensagens junto de todos os controles complementam a validação nativa.
  for (const campo of campos) {
    if (!campo.id) continue;
    let erro = document.querySelector(`#erro-${campo.id}`);
    if (!erro) {
      erro = document.createElement('small'); erro.id = `erro-${campo.id}`; erro.className = 'erro';
      campo.closest('.campo, .checkbox').append(erro);
    }
    const descricoes = new Set((campo.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
    descricoes.add(erro.id); campo.setAttribute('aria-describedby', [...descricoes].join(' '));
  }
  function mostrarValidacao(campo) {
    const valido = validarCampo(campo);
    const erro = document.querySelector(`#erro-${campo.id}`);
    const mensagem = campo.validity.valueMissing ? 'Preencha este campo obrigatório.' : campo.validationMessage;
    erro.textContent = valido ? '' : mensagem;
    campo.setAttribute('aria-invalid', String(!valido));
    campo.dataset.validado = 'true';
    return valido;
  }
  function aplicarMascara(campo) {
    const formatar = mascaras[campo.id]; if (!formatar) return;
    const posicao = campo.selectionStart ?? campo.value.length;
    const final = posicao === campo.value.length;
    const quantidade = somenteDigitos(campo.value.slice(0, posicao)).length;
    campo.value = formatar(campo.value);
    let cursor = 0, digitos = 0;
    while (cursor < campo.value.length && digitos < quantidade) {
      if (/\d/.test(campo.value[cursor])) digitos++;
      cursor++;
    }
    if (document.activeElement === campo) campo.setSelectionRange(final ? campo.value.length : cursor, final ? campo.value.length : cursor);
  }
  function apresentarResultado(texto, tipo) {
    resultado.textContent = texto; resultado.dataset.tipo = tipo; resultado.focus();
    notificar(texto, tipo);
  }
  function atualizarResumo() {
    const leitura = lerRegistro();
    const resumo = document.querySelector('#resumo-salvo');
    // textContent evita interpretar como HTML qualquer conteúdo do localStorage.
    resumo.textContent = leitura.erro || (leitura.dados ? `Registro salvo para ${leitura.dados.nome}. Projeto: ${leitura.dados.projeto}.` : 'Nenhum registro salvo.');
    resumo.classList.toggle('erro', Boolean(leitura.erro));
    document.querySelector('#recuperar').disabled = !leitura.dados;
    document.querySelector('#excluir').disabled = !leitura.dados && !leitura.erro;
  }
  form.addEventListener('input', evento => {
    const campo = evento.target;
    aplicarMascara(campo); campo.setCustomValidity('');
    campo.removeAttribute('aria-invalid'); delete campo.dataset.validado;
    document.querySelector(`#erro-${campo.id}`).textContent = '';
    resultado.textContent = '';
  }, opcoes);
  form.addEventListener('focusout', evento => {
    if (campos.includes(evento.target)) mostrarValidacao(evento.target);
  }, opcoes);
  form.addEventListener('change', evento => {
    if (campos.includes(evento.target)) { aplicarMascara(evento.target); mostrarValidacao(evento.target); }
  }, opcoes);
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    for (const campo of campos) aplicarMascara(campo);
    const invalidos = campos.filter(campo => !mostrarValidacao(campo));
    if (invalidos.length) {
      resultado.textContent = `Revise ${invalidos.length} campo(s) indicado(s) antes de salvar.`; resultado.dataset.tipo = 'erro';
      invalidos[0].focus(); invalidos[0].reportValidity(); return;
    }
    const salvar = salvarRegistro(Object.fromEntries(new FormData(form)));
    if (salvar.erro) { apresentarResultado(salvar.erro, 'erro'); return; }
    atualizarResumo();
    apresentarResultado('Cadastro demonstrativo salvo neste navegador. Nenhum dado foi enviado a um servidor.', 'sucesso');
  }, opcoes);
  form.addEventListener('reset', () => {
    for (const campo of campos) {
      campo.setCustomValidity(''); campo.removeAttribute('aria-invalid'); delete campo.dataset.validado;
      document.querySelector(`#erro-${campo.id}`).textContent = '';
    }
    resultado.textContent = ''; notificar('Campos limpos. O registro salvo permanece até você excluí-lo.');
  }, opcoes);
  document.querySelector('#recuperar').addEventListener('click', () => {
    const leitura = lerRegistro();
    if (!leitura.dados) { atualizarResumo(); notificar(leitura.erro || 'Nenhum registro disponível.', 'erro'); return; }
    form.reset();
    for (const nome of ['nome','email','projeto','disponibilidade','mensagem']) form.elements[nome].value = leitura.dados[nome];
    notificar('Dados recuperados. Os campos não armazenados precisam ser preenchidos novamente.'); form.elements.nome.focus();
  }, opcoes);
  document.querySelector('#excluir').addEventListener('click', async () => {
    if (!await confirmarExclusao() || controle.signal.aborted) return;
    const exclusao = excluirRegistro(); atualizarResumo();
    if (exclusao.erro) { apresentarResultado(exclusao.erro, 'erro'); return; }
    form.reset(); apresentarResultado('Registro excluído deste navegador.', 'sucesso');
  }, opcoes);
  window.addEventListener('storage', atualizarResumo, opcoes);
  // noValidate é ativado somente após o JS assumir a apresentação dos erros.
  // As APIs checkValidity/reportValidity continuam usando required, type e pattern.
  form.noValidate = true;
  document.querySelector('#enviar').disabled = false;
  atualizarResumo();
  return () => controle.abort();
}
