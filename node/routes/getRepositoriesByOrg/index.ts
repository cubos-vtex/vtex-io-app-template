import { method } from '@vtex/api'

import { createHandlers } from '../../utils'

async function getRepositoriesByOrg(ctx: Context, next?: NextFn) {
  ctx.body = await ctx.state.githubController.getRepositoriesByOrg()
  await next?.()
}

export default method({ GET: createHandlers([getRepositoriesByOrg]) })
