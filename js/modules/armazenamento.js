// Uma chave exclusiva evita misturar este projeto com outros dados da mesma origem.
export const CHAVE = 'raizes-amanha:cadastro:v1';
const limites = { nome: 100, email: 150, projeto: 20, disponibilidade: 20, mensagem: 500 };
const projetos = ['educacao', 'alimentacao', 'comunidade'];
const horarios = ['semana', 'fim-semana', 'eventual'];

function registroValido(dados) {
  return dados && dados.versao === 1 &&
    Object.entries(limites).every(([campo, max]) => typeof dados[campo] === 'string' && dados[campo].length <= max) &&
    dados.nome.trim().length >= 3 && /^[^\s@]+@[^\s@]+$/.test(dados.email) &&
    projetos.includes(dados.projeto) && horarios.includes(dados.disponibilidade);
}
export function lerRegistro() {
  try {
    const texto = localStorage.getItem(CHAVE);
    if (!texto) return { dados: null };
    const dados = JSON.parse(texto);
    if (!registroValido(dados)) throw new Error('Formato inesperado');
    return { dados };
  } catch {
    return { dados: null, erro: 'Não foi possível ler o registro local. Ele pode estar corrompido ou o armazenamento pode estar bloqueado.' };
  }
}
export function salvarRegistro(valores) {
  // Lista explícita: CPF, telefone, nascimento e endereço nunca são persistidos.
  const dados = { versao: 1 };
  for (const campo of Object.keys(limites)) dados[campo] = String(valores[campo] ?? '').trim();
  if (!registroValido(dados)) return { erro: 'Os dados do registro estão incompletos ou inválidos.' };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    return { dados };
  } catch {
    return { erro: 'Não foi possível salvar neste navegador. Verifique se o armazenamento está permitido ou se há espaço disponível.' };
  }
}
export function excluirRegistro() {
  try { localStorage.removeItem(CHAVE); return { ok: true }; }
  catch { return { erro: 'Não foi possível excluir o registro. Verifique as permissões do navegador.' }; }
}
