import {
  AppSettingsController,
  GithubController,
  TaskMasterdataController,
} from '../controllers'

export async function setupControllers(ctx: Context, next?: NextFn) {
  ctx.state = {
    ...ctx.state,
    appSettingsController: new AppSettingsController(ctx),
    taskMasterdataController: new TaskMasterdataController(ctx),
    githubController: new GithubController(ctx),
  }

  await next?.()
}
