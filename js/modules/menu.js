export function iniciarMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navegacao');
  const botao = document.querySelector('#botao-projetos');
  const submenu = document.querySelector('#submenu');
  const desktop = matchMedia('(min-width: 768px)');
  const abrirSubmenu = (aberto) => { submenu.hidden = !aberto; botao.setAttribute('aria-expanded', String(aberto)); };
  const abrirMenu = (aberto) => {
    toggle.setAttribute('aria-expanded', String(aberto));
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('aberto', aberto);
    if (!aberto) abrirSubmenu(false);
  };
  toggle.addEventListener('click', () => abrirMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  botao.addEventListener('click', () => abrirSubmenu(submenu.hidden));
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;
    if (!submenu.hidden) { abrirSubmenu(false); botao.focus(); }
    else if (toggle.getAttribute('aria-expanded') === 'true') { abrirMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.dropdown')) abrirSubmenu(false);
    if (!evento.target.closest('.cabecalho')) abrirMenu(false);
  });
  nav.addEventListener('click', (evento) => { if (evento.target.closest('a')) abrirMenu(false); });
  nav.addEventListener('focusout', () => setTimeout(() => {
    if (!document.querySelector('.dropdown').contains(document.activeElement)) abrirSubmenu(false);
  }, 0));
  desktop.addEventListener('change', () => {
    const focoEscondido = !desktop.matches && nav.contains(document.activeElement);
    abrirMenu(false);
    if (focoEscondido) toggle.focus();
  });
  return () => abrirMenu(false);
}
