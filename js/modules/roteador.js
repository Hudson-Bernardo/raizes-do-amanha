import { obterTemplate } from './templates.js';
import { iniciarFormulario } from './formulario.js';
export function iniciarRoteador(fecharMenu) {
  let desmontar = () => {};
  const titulos = { inicio: 'Início', projetos: 'Projetos', cadastro: 'Cadastro' };
  function renderizar() {
    // Âncora de acessibilidade não representa uma troca de tela.
    if (location.hash === '#conteudo') { document.querySelector('#conteudo').focus(); return; }
    desmontar(); fecharMenu();
    const [caminho, consulta = ''] = location.hash.slice(1).replace(/^\//, '').split('?');
    const rota = caminho || 'inicio'; const parametros = new URLSearchParams(consulta);
    const main = document.querySelector('#conteudo');
    // Apenas templates locais constantes são inseridos; parâmetros não são interpolados em HTML.
    main.innerHTML = obterTemplate(rota);
    document.title = `${titulos[rota] || 'Página não encontrada'} | Raízes do Amanhã`;
    document.querySelectorAll('[data-rota]').forEach(link => {
      if (link.dataset.rota === rota) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('#botao-projetos').classList.toggle('pagina-atual', rota === 'projetos');
    if (rota === 'cadastro') desmontar = iniciarFormulario(parametros); else desmontar = () => {};
    main.focus({ preventScroll: true });
    if (rota === 'inicio' && parametros.get('secao') === 'contato') document.querySelector('#contato').scrollIntoView();
    else window.scrollTo(0, 0);
  }
  // O histórico de hashes funciona em servidor estático, inclusive ao recarregar rotas.
  window.addEventListener('hashchange', renderizar);
  if (!location.hash || location.hash === '#conteudo') history.replaceState(null, '', '#/inicio');
  renderizar();
}
