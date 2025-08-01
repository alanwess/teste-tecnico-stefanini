export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  const cpfArray = cleanCPF.split('').map(Number);

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += cpfArray[i] * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10 || firstDigit === 11) firstDigit = 0;
  if (firstDigit !== cpfArray[9]) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += cpfArray[i] * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10 || secondDigit === 11) secondDigit = 0;
  if (secondDigit !== cpfArray[10]) return false;

  return true;
}

export function isValidDate(date: string): boolean {
  if (!date) return false;

  const parsedDate = new Date(date);
  const currentDate = new Date();

  // Verifica se a data é válida
  if (isNaN(parsedDate.getTime())) return false;

  // Verifica se a data não é futura
  if (parsedDate > currentDate) return false;

  // Verifica se o formato é YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  return true;
}