interface ErrorResponse {
  message?: string
  errorCode?: string
  error?: string | { validationErrors?: any[] }
}

const ERROR_MESSAGES: Record<string, string> = {
  ORGANIZATION_EMAIL_EXISTS: 'Já existe uma organização com este email',
  ORGANIZATION_DOCUMENT_EXISTS: 'Já existe uma organização com este CNPJ',
  ORGANIZATION_PHONE_EXISTS: 'Já existe uma organização com este telefone',
  ORGANIZATION_HAS_RELATIONS:
    'Esta organização possui vínculos e não pode ser excluída',
  EMAIL_EXISTS: 'Este email já está em uso',
  ORGANIZATION_NOT_FOUND: 'Organização não encontrada',
  USER_NOT_FOUND: 'Usuário não encontrada',
  INVALID_ORGANIZATION: 'Organização inválida',
  INVALID_ORG_TYPE: 'Tipo de organização inválido',
  CANNOT_DELETE_ACTIVE_USER:
    'Não é possível excluir um usuário ativo. Inative-o primeiro.',
  CANNOT_SELF_DELETE: 'Você não pode excluir a si mesmo',
}

export function getErrorMessage(
  error: ErrorResponse | undefined | null,
): string {
  // Garantir que error não é undefined/null
  if (!error) {
    return 'Ocorreu um erro inesperado'
  }

  // Se error.error é um objeto (erro de validação)
  if (error.error && typeof error.error === 'object') {
    return error.message || 'Dados de entrada inválidos'
  }

  // Backend retorna "error" ao invés de "errorCode" quando é string
  const code =
    error.errorCode ||
    (typeof error.error === 'string' ? error.error : undefined)

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code]
  }

  return error.message || 'Ocorreu um erro inesperado'
}
