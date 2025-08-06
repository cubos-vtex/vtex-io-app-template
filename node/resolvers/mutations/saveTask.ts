export async function saveTask(_: unknown, input: SaveTaskInput, ctx: Context) {
  if (input.id) {
    return ctx.state.taskMasterdataController.update(input)
  }

  return ctx.state.taskMasterdataController.create(input)
}
