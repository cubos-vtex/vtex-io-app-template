export async function task(_: unknown, { id }: GetById, ctx: Context) {
  return ctx.state.taskMasterdataController.get(id)
}
