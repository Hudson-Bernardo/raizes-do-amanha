// Máscaras e verificadores puros podem ser testados sem acessar a página.
export const somenteDigitos = (valor) => valor.replace(/\D/g, '');

export function formatarCPF(valor) {
  return somenteDigitos(valor).slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function formatarCEP(valor) {
  return somenteDigitos(valor).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
}

export function formatarTelefone(valor) {
  const digitos = somenteDigitos(valor).slice(0, 11);
  if (!digitos) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const corte = numero.length > 8 ? 5 : 4;
  return `(${ddd}) ${numero.slice(0, corte)}${numero.length > corte ? '-' + numero.slice(corte) : ''}`;
}

export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  // CPFs com todos os dígitos iguais são inválidos mesmo se passarem pelo cálculo.
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  // O primeiro verificador usa pesos de 10 a 2; o segundo usa de 11 a 2.
  for (let tamanho = 9; tamanho <= 10; tamanho += 1) {
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const resto = soma % 11;
    const verificador = resto < 2 ? 0 : 11 - resto;
    if (verificador !== Number(cpf[tamanho])) return false;
  }
  // Este cálculo verifica a estrutura, não a existência ou titularidade do CPF.
  return true;
}


export function validarCampo(campo) {
  campo.setCustomValidity('');
  const valor = campo.value.trim();
  if (campo.id === 'cpf' && valor && !cpfValido(valor)) {
    campo.setCustomValidity('Informe um CPF com 11 dígitos e verificadores válidos.');
  } else if (campo.required && campo.type === 'text' && (!valor || (campo.id === 'nome' && valor.length < 3))) {
    campo.setCustomValidity('Preencha este campo com um texto válido.');
  }
  return campo.checkValidity();
}
