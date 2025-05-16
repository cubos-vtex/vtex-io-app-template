import { method } from '@vtex/api'

import { createHandlers } from '../utils'

async function getRepositoriesByOrg(ctx: Context) {
  ctx.body = await ctx.state.githubController.getRepositoriesByOrg()
}

export default method({ GET: createHandlers([getRepositoriesByOrg]) })
