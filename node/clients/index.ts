import type { Cached, ClientsConfig, ServiceContext } from '@vtex/api'
import { IOClients, LRUCache } from '@vtex/api'

import { Checkout } from './Checkout'
import { MasterdataSchemas } from './MasterdataSchemas'

export class Clients extends IOClients {
  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get masterdataSchemas() {
    return this.getOrSet('masterdataSchemas', MasterdataSchemas)
  }
}

declare global {
  type Context = ServiceContext<Clients>
}

const TIMEOUT_MS = 800

const memoryCache = new LRUCache<string, Cached>({ max: 5000 })

metrics.trackCache('default', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
      memoryCache,
    },
  },
}

export default clients
