import { checkSchemas, setResponseMetadata, setupControllers } from '.'

export function createHandlers(handlers: Handler[]) {
  return [setupControllers, ...handlers, setResponseMetadata]
}

export function createMasterdataHandler(handler: Handler) {
  return createHandlers([checkSchemas, handler])
}
