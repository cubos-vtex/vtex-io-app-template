import type { ClientsConfig } from '@vtex/api'
import { IOClients } from '@vtex/api'
import { vbaseFor } from '@vtex/clients'

import { Github } from './Github'

const [APP_NAME] = String(process.env.VTEX_APP_ID).split('@')

export class Clients extends IOClients {
  public get appSettings() {
    return this.getOrSet('appSettings', vbaseFor<string, AppSettings>(APP_NAME))
  }

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
