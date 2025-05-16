import { AuthenticationError, ForbiddenError } from '@vtex/api'

export function throwAuthenticationError(): never {
  throw new AuthenticationError('store/not-authenticated-error')
}

export function throwForbiddenError(): never {
  throw new ForbiddenError('store/forbidden-error')
}
