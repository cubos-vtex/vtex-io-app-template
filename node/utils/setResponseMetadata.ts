export async function setResponseMetadata(ctx: Context, next?: NextFn) {
  ctx.status = 200

  await next?.()
}
