/**
 * Client-side error message parser.
 * Maps HTTP status codes and network errors to user-friendly messages.
 * NEVER expose raw API error messages to users.
 */

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Please check your input and try again.',
  401: 'You need to sign in to do this.',
  403: "You don't have permission to do this.",
  404: "We couldn't find what you're looking for.",
  408: 'The request timed out. Please try again.',
  409: 'This conflicts with existing data.',
  422: 'Please check the highlighted fields.',
  429: 'Too many requests. Please wait a moment.',
  500: 'Something went wrong on our end. Try again shortly.',
  502: 'Service temporarily unavailable.',
  503: "We're under maintenance. Back shortly.",
  0: 'Check your internet connection.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export interface ParsedApiError {
  message: string;
  statusCode: number | null;
  fieldErrors: Record<string, string[]> | null;
}

/**
 * Parse any error into a user-friendly message.
 * Handles: network errors, HTTP status codes, API error bodies, generic Error objects.
 */
export function parseApiError(error: unknown): ParsedApiError {
  // Network error (no response)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return { message: ERROR_MESSAGES[0], statusCode: null, fieldErrors: null };
  }

  // Our api client throws Error with the server message
  if (error instanceof Error) {
    // If the error message matches a known server validation message, use it
    // (api client already extracts data.message from the response)
    const msg = error.message;

    // Check for field-level validation errors (422 pattern)
    if ('errors' in (error as any) && typeof (error as any).errors === 'object') {
      return {
        message: ERROR_MESSAGES[422],
        statusCode: 422,
        fieldErrors: (error as any).errors as Record<string, string[]>,
      };
    }

    // If the message looks like a raw server error, map it
    if (msg === 'Request failed' || msg === 'Internal server error') {
      return { message: ERROR_MESSAGES[500], statusCode: 500, fieldErrors: null };
    }

    // Use the server-provided message (api client already extracts human-readable messages)
    return { message: msg || FALLBACK_MESSAGE, statusCode: null, fieldErrors: null };
  }

  // Status code directly
  if (typeof error === 'number') {
    return {
      message: ERROR_MESSAGES[error] || FALLBACK_MESSAGE,
      statusCode: error,
      fieldErrors: null,
    };
  }

  return { message: FALLBACK_MESSAGE, statusCode: null, fieldErrors: null };
}

/**
 * Simple helper to get a user-friendly error string from any error.
 */
export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}

export { ERROR_MESSAGES };
