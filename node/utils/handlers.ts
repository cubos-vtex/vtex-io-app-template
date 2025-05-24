import {
  checkSchemas,
  checkStoreUser,
  setResponseMetadata,
  setupControllers,
} from '.'

function generateHandler(handler: Handler) {
  return async function genericHandler(ctx: Context, next?: NextFn) {
    await handler(ctx)
    await next?.()
  }
}

export function createHandlers(handlers: Handler[]) {
  return [
    setupControllers,
    ...handlers.map(generateHandler),
    setResponseMetadata,
  ]
}

export function createStoreAuthenticatedHandlers(handlers: Handler[]) {
  return createHandlers([checkStoreUser, ...handlers])
}

export function createAuthenticatedMasterdataHandlers(handlers: Handler[]) {
  return createStoreAuthenticatedHandlers([checkSchemas, ...handlers])
}
