import axios from 'axios';
import type { NormalizedError, ValidationErrorDetail } from '@/types/api.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Axios instance pre-configured for the MCP Research Backend.
 * Timeout is set to 320s (slightly above the backend's 300s default).
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 320_000,
});

// ─── Response interceptor — normalize errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized: Partial<NormalizedError> = {
      statusCode: 0,
      isTimeout: false,
      isServiceUnavailable: false,
      isValidation: false,
    };

    if (error.response) {
      const status: number = error.response.status;
      const detail = error.response.data?.detail;

      normalized.statusCode = status;
      normalized.detail = detail;

      switch (status) {
        case 408:
          normalized.isTimeout = true;
          normalized.userMessage =
            typeof detail === 'string'
              ? detail
              : 'Request timed out. Try a simpler query or search for papers first.';
          break;
        case 404:
          normalized.userMessage =
            typeof detail === 'string'
              ? detail
              : 'The requested resource was not found.';
          break;
        case 422:
          normalized.isValidation = true;
          normalized.userMessage = 'Please check your input and try again.';
          break;
        case 503:
          normalized.isServiceUnavailable = true;
          normalized.userMessage =
            'The research backend is currently offline. Please try again later.';
          break;
        case 500:
        default:
          normalized.userMessage =
            'Something went wrong. Please try again.';
          break;
      }
    } else if (error.request) {
      normalized.statusCode = 0;
      normalized.userMessage =
        'Cannot connect to the backend server. Is it running at ' + BASE_URL + '?';
      normalized.detail = normalized.userMessage;
    }

    // Attach normalized fields to the error object
    Object.assign(error, normalized);
    return Promise.reject(error);
  },
);

// ─── Type guard helpers ───────────────────────────────────────────────────────

export function isValidationError(
  detail: string | ValidationErrorDetail[] | undefined,
): detail is ValidationErrorDetail[] {
  return Array.isArray(detail);
}
