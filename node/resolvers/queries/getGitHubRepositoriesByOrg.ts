export async function getGitHubRepositoriesByOrg(
  _: unknown,
  { org, sort = 'full_name', direction = 'asc' }: GetOrgRepositoriesArgs,
  ctx: Context
) {
  const repositories = await ctx.clients.github.getRepositoriesByOrg(org, {
    sort,
    direction,
  })

  return repositories
}
