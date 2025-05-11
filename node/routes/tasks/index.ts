import { method } from '@vtex/api'

import { createMasterdataHandler } from '../../utils'

async function searchTasks(ctx: Context, next?: NextFn) {
  ctx.body = await ctx.state.taskMasterdataController.search()
  await next?.()
}

async function createTask(ctx: Context, next?: NextFn) {
  ctx.body = await ctx.state.taskMasterdataController.create()
  await next?.()
}

export default method({
  GET: createMasterdataHandler(searchTasks),
  POST: createMasterdataHandler(createTask),
})
