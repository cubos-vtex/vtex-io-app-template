export async function getGitHubRepositoriesByOrg(
  _: unknown,
  { org, sort = 'full_name', direction = 'asc' }: GetOrgRepositoriesArgs,
  ctx: Context
) {
  return ctx.clients.github.getRepositoriesByOrg(org, {
    sort,
    direction,
  })
}
