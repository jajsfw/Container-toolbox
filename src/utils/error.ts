export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error)
  
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    }
  }
  
  return {
    message: '发生未知错误',
    code: 'UNKNOWN_ERROR'
  }
} 