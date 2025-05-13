import { SCHEMAS, SCHEMA_VERSION } from '../masterdata-setup'

export async function checkSchemas(ctx: Context, next?: NextFn) {
  const settings = await ctx.state.appSettingsController.get()
  const currentSchemaHash = JSON.stringify(SCHEMAS)

  if (settings.schemaHash === currentSchemaHash) {
    return next?.()
  }

  await Promise.all(
    Object.values(SCHEMAS).map((schema) =>
      ctx.clients.masterdata
        .createOrUpdateSchema({
          dataEntity: schema.name,
          schemaName: SCHEMA_VERSION,
          schemaBody: schema.body,
        })
        .catch((e) => {
          if (e.response.status !== 304) {
            throw e
          }
        })
    )
  )

  await ctx.state.appSettingsController
    .save({
      ...settings,
      schemaHash: currentSchemaHash,
    })
    .catch(() => null)

  await next?.()
}
