export interface ValidationError {
  field: string
  message: string
  value?: unknown
}

export interface SuccessResponse<T> {
  success: true
  message?: string
  data: T
}

export interface ErrorResponse {
  success: false
  error: string | { validationErrors: ValidationError[] }
  message?: string
}
