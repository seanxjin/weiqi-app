import { ApiError } from '@/shared/api'

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'The server is unavailable. Please try again.'
    const messages: Record<string, string> = {
      INVALID_CREDENTIALS: 'The username, email, or password is incorrect.',
      TWO_FACTOR_REQUIRED: 'Enter the 6-digit code from your authenticator to continue.',
      INVALID_TWO_FACTOR: 'That authenticator code is incorrect. Please try again.',
      EMAIL_UNCONFIRMED: 'Please confirm your email address before signing in.',
      ACCOUNT_CLOSED: 'This account is closed and cannot sign in.',
      USERNAME_TAKEN: 'That username is already in use. Please choose another.',
      EMAIL_TAKEN: 'That email address is already in use.',
      INVALID_TOKEN: 'This link is invalid or has expired. Request a new email to continue.',
      UNAUTHORIZED: 'Your sign-in session has expired. Please start again.',
      CONFLICT: 'Your signup could not be completed. Please start again.',
      FORBIDDEN: 'This request was blocked. Please refresh the page and try again.',
    }
    if (error.code === 'RATE_LIMITED') {
      return error.retryAfter
        ? `Too many attempts. Please wait ${Math.ceil(error.retryAfter)} seconds before trying again.`
        : 'Too many attempts. Please wait before trying again.'
    }
    return messages[error.code] ?? error.message
  }
  if (error instanceof TypeError)
    return 'Unable to reach the server. Check your connection and try again.'
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}
