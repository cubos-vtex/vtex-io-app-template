import { AuthenticationError, ForbiddenError, NotFoundError } from '@vtex/api'

export class EntityNotFoundError extends NotFoundError {
  constructor(entity: string) {
    super(`Document not found in entity ${entity}`)
    this.name = 'EntityNotFoundError'
  }
}

export class StoreAuthenticationError extends AuthenticationError {
  constructor() {
    super('store/not-authenticated-error')
    this.name = 'StoreAuthenticationError'
  }
}

export class StoreForbiddenError extends ForbiddenError {
  constructor() {
    super('store/forbidden-error')
    this.name = 'EntityNotModifiedError'
  }
}
