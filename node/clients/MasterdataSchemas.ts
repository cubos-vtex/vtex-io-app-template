import { AuthenticatedJanusClient } from './utils/AuthenticatedJanusClient'

type Schema = { name: string }

export class MasterdataSchemas extends AuthenticatedJanusClient {
  private async getSchemas(dataEntity: string) {
    return this.http.get<Schema[]>(`/api/dataentities/${dataEntity}/schemas`)
  }

  public async getLastSchema(dataEntity: string) {
    const schemas = await this.getSchemas(dataEntity)
    const [lastSchema] = schemas
      .filter((s) => /^\d+\.\d+\.\d+$/.test(s.name))
      .map((s) => s.name)
      .sort((a, b) => b.localeCompare(a))

    return lastSchema
  }
}
