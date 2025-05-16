import { method } from '@vtex/api'

import { createAuthenticatedMasterdataHandlers } from '../utils'

async function searchTasks(ctx: Context) {
  ctx.body = await ctx.state.taskMasterdataController.search()
}

async function createTask(ctx: Context) {
  ctx.body = await ctx.state.taskMasterdataController.create()
}

export default method({
  GET: createAuthenticatedMasterdataHandlers([searchTasks]),
  POST: createAuthenticatedMasterdataHandlers([createTask]),
})
