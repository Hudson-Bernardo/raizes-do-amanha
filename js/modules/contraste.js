// Preferência visual independente dos dados de cadastro.
export const CHAVE_CONTRASTE = 'raizes-amanha:contraste:v1';

export function iniciarContraste() {
  const botao = document.querySelector('#alternar-contraste');
  if (!botao) return;
  const aplicar = ativo => {
    document.documentElement.dataset.contraste = ativo ? 'alto' : 'padrao';
    botao.setAttribute('aria-pressed', String(ativo));
  };
  // Se o armazenamento estiver bloqueado, a alternância continua funcionando.
  let salvo = false;
  try { salvo = localStorage.getItem(CHAVE_CONTRASTE) === 'alto'; } catch {}
  aplicar(salvo);
  botao.hidden = false;
  botao.addEventListener('click', () => {
    const ativo = botao.getAttribute('aria-pressed') !== 'true';
    aplicar(ativo);
    try { localStorage.setItem(CHAVE_CONTRASTE, ativo ? 'alto' : 'padrao'); } catch {}
  });
  window.addEventListener('storage', evento => {
    if (evento.key === CHAVE_CONTRASTE || evento.key === null) {
      aplicar(evento.newValue === 'alto');
    }
  });
}
