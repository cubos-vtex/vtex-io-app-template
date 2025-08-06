export async function tasks(
  _: unknown,
  { input }: { input?: SearchInput },
  ctx: Context
) {
  return ctx.state.taskMasterdataController.search(input)
}
