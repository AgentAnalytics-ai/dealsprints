/**
 * Error Handler Utility
 * Provides consistent error message extraction for TypeScript strict mode
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error !== null && error !== undefined) {
    return String(error);
  }
  return 'Unknown error';
}
