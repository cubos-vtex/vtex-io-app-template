import type { ClientsConfig } from '@vtex/api'
import { IOClients } from '@vtex/api'

import { Github } from './Github'

export class Clients extends IOClients {
  public get github() {
    return this.getOrSet('github', Github)
  }
}

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: 30000,
    },
  },
}

export default clients
