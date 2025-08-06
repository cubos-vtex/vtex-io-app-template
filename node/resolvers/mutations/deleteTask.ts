export async function deleteTask(_: unknown, { id }: GetById, ctx: Context) {
  return ctx.state.taskMasterdataController.delete(id)
}
