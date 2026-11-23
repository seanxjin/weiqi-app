export const field = (form: FormData, name: string) => String(form.get(name) ?? '')
export const usernamePattern = '[A-Za-z0-9]+(?:[_-]?[A-Za-z0-9]+)*'
export const passwordGuidance = 'Use at least 8 characters and no more than 72 UTF-8 bytes.'

export function validateNewPassword(password: string) {
  if (password.length < 8) throw new Error('Use at least 8 characters for your password.')
  if (new TextEncoder().encode(password).length > 72) {
    throw new Error('Your password must not exceed 72 UTF-8 bytes.')
  }
}
