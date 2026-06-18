import type { NormalizedError, ValidationErrorDetail } from '@/types/api.types';

/**
 * Extract a user-friendly error message from an Axios error or unknown error.
 */
export function parseApiError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'An unexpected error occurred.';

  const err = error as Record<string, unknown>;

  // Normalized error from our interceptor
  if (typeof err.userMessage === 'string') return err.userMessage;

  // Raw error with response
  if (err.response && typeof err.response === 'object') {
    const response = err.response as Record<string, unknown>;
    const data = response.data as Record<string, unknown> | undefined;
    const detail = data?.detail;
    if (typeof detail === 'string') return detail;
  }

  // Network error
  if (err.message && typeof err.message === 'string') return err.message;

  return 'An unexpected error occurred.';
}

/**
 * Extract validation errors as a field→message map.
 */
export function parseValidationErrors(
  detail: ValidationErrorDetail[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const item of detail) {
    const field = item.loc[item.loc.length - 1]?.toString() ?? 'unknown';
    errors[field] = item.msg;
  }
  return errors;
}

/**
 * Check if the response signals a misconfigured LLM (HTTP 200 but error response).
 */
export function isLLMConfigError(response: string): boolean {
  return (
    response.includes('not configured') ||
    response.includes('Check your .env settings')
  );
}

/**
 * Type guard: check if an error is service unavailable (503).
 */
export function isServiceUnavailable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as Partial<NormalizedError>;
  return err.isServiceUnavailable === true || err.statusCode === 503;
}

/**
 * Type guard: check if an error is a timeout (408).
 */
export function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as Partial<NormalizedError>;
  return err.isTimeout === true || err.statusCode === 408;
}
