export const VALIDATION_MESSAGES = {
  REQUIRED: 'Preenchimento obrigatório.',
  EMAIL_INVALID: 'E-mail inválido.',
  PASSWORD_MIN_LENGTH: (min: number) =>
    `Senha deve ter no mínimo ${min} caracteres.`,
  NAME_MIN_LENGTH: (min: number) =>
    `Nome deve ter no mínimo ${min} caracteres.`,
  CPF_INVALID: 'CPF inválido.',
  CNPJ_INVALID: 'CNPJ inválido.',
  CPF_CNPJ_INVALID: 'CPF/CNPJ inválido.',
  PHONE_INVALID: 'Telefone inválido.',
  CEP_INVALID: 'CEP inválido.',
  DATE_INVALID: 'Data inválida.',
  DATE_FUTURE: 'Data não pode ser futura.',
  DATE_PAST: 'Data não pode ser passada.',
  NUMBER_POSITIVE: 'Deve ser um número positivo.',
  NUMBER_MIN: (min: number) => `Valor mínimo é ${min}.`,
  NUMBER_MAX: (max: number) => `Valor máximo é ${max}.`,
  PASSWORD_CONFIRMATION_MISMATCH: 'As senhas não coincidem.',
  URL_INVALID: 'URL inválida.',
  FILE_REQUIRED: 'Arquivo obrigatório.',
  FILE_SIZE_MAX: (maxSizeMB: number) =>
    `Tamanho máximo do arquivo é ${maxSizeMB}MB.`,
  FILE_TYPE_INVALID: (allowedTypes: string) =>
    `Tipos permitidos: ${allowedTypes}.`,
  SELECT_REQUIRED: 'Selecione uma opção.',
  TEXT_MIN_LENGTH: (min: number) => `Deve ter pelo menos ${min} caracteres.`,
  TEXT_MAX_LENGTH: (max: number) => `Deve ter no máximo ${max} caracteres.`,
  CURRENCY_INVALID: 'Valor monetário inválido.',
  CURRENCY_POSITIVE: 'Valor deve ser positivo.',
} as const
