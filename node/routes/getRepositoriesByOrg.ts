import { UserInputError } from '@vtex/api'

export async function getRepositoriesByOrg(ctx: Context) {
  const { org } = ctx.vtex.route.params
  const { sort = 'full_name', direction = 'asc' } = ctx.query

  if (!org || Array.isArray(org)) {
    throw new UserInputError('Org is required')
  }

  const repositories = await ctx.clients.github.getRepositoriesByOrg(org, {
    sort,
    direction,
  })

  ctx.status = 200
  ctx.body = repositories
}
