import { StoreAuthenticationError } from '.'

const SESSION_AUTHENTICATION_ITEMS = ['authentication.storeUserEmail']

export async function checkStoreUser(ctx: Context, next?: NextFn) {
  const { storeUserAuthToken, sessionToken } = ctx.vtex

  if (!storeUserAuthToken || !sessionToken) {
    throw new StoreAuthenticationError()
  }

  const { sessionData } = await ctx.clients.session.getSession(
    sessionToken,
    SESSION_AUTHENTICATION_ITEMS
  )

  const storeUserEmail =
    sessionData.namespaces.authentication?.storeUserEmail?.value

  if (!storeUserEmail) {
    throw new StoreAuthenticationError()
  }

  ctx.state.storeUserEmail = storeUserEmail

  await next?.()
}
