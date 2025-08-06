import { SCHEMAS, SCHEMA_VERSION } from '../masterdata-setup'

export async function checkSchemas(ctx: Context, next?: NextFn) {
  const settings = await ctx.state.appSettingsController.get()
  const currentSchemaHash = JSON.stringify(SCHEMAS)

  if (settings.schemaHash === currentSchemaHash) {
    return next?.()
  }

  await Promise.all(
    Object.entries(SCHEMAS).map(([dataEntity, schemaBody]) =>
      ctx.clients.masterdata
        .createOrUpdateSchema({
          dataEntity,
          schemaBody,
          schemaName: SCHEMA_VERSION,
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
