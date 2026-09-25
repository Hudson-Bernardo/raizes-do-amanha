let temporizador;
export function notificar(texto, tipo = 'sucesso') {
  const toast = document.querySelector('#notificacao');
  clearTimeout(temporizador);
  document.querySelector('#texto-toast').textContent = texto;
  toast.dataset.tipo = tipo;
  toast.hidden = false;
  // Se o usuário estiver interagindo com a notificação, ela permanece visível.
  temporizador = setTimeout(() => { if (!toast.matches(':hover, :focus-within')) toast.hidden = true; }, 7000);
}
export function iniciarFeedback() {
  document.querySelector('#notificacao button').addEventListener('click', () => {
    document.querySelector('#notificacao').hidden = true;
    document.querySelector('#conteudo').focus({ preventScroll: true });
  });
}
export function confirmarExclusao() {
  const modal = document.querySelector('#confirmacao');
  if (modal.open) return Promise.resolve(false);
  return new Promise((resolve) => {
    modal.returnValue = 'cancelar';
    modal.addEventListener('close', () => resolve(modal.returnValue === 'confirmar'), { once: true });
    modal.showModal();
  });
}
