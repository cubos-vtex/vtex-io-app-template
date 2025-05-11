import { method } from '@vtex/api'

import { createMasterdataHandler } from '../utils'

async function getTask(ctx: Context, next?: NextFn) {
  ctx.body = await ctx.state.taskMasterdataController.get()
  await next?.()
}

async function updateTask(ctx: Context, next?: NextFn) {
  ctx.body = await ctx.state.taskMasterdataController.update()
  await next?.()
}

async function deleteTask(ctx: Context, next?: NextFn) {
  await ctx.state.taskMasterdataController.delete()
  await next?.()
}

export default method({
  GET: createMasterdataHandler(getTask),
  PATCH: createMasterdataHandler(updateTask),
  DELETE: createMasterdataHandler(deleteTask),
})
