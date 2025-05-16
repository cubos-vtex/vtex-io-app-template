import { method } from '@vtex/api'

import { createAuthenticatedMasterdataHandlers } from '../utils'

async function getTask(ctx: Context) {
  ctx.body = await ctx.state.taskMasterdataController.get()
}

async function updateTask(ctx: Context) {
  ctx.body = await ctx.state.taskMasterdataController.update()
}

async function deleteTask(ctx: Context) {
  ctx.body = await ctx.state.taskMasterdataController.delete()
}

export default method({
  GET: createAuthenticatedMasterdataHandlers([getTask]),
  PATCH: createAuthenticatedMasterdataHandlers([updateTask]),
  DELETE: createAuthenticatedMasterdataHandlers([deleteTask]),
})
