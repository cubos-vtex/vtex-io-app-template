import { AuthenticatedJanusClient } from './utils/AuthenticatedJanusClient'

type CustomDataArgs = {
  orderFormId: string
  appId: string
  appFieldName: string
  value?: unknown
}

export class Checkout extends AuthenticatedJanusClient {
  private getCustomDataRoute(args: CustomDataArgs) {
    const { orderFormId, appId, appFieldName } = args

    return `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}/${appFieldName}`
  }

  public async setCustomData({ value, ...args }: CustomDataArgs) {
    return this.http.put(this.getCustomDataRoute(args), { value })
  }

  public async deleteCustomData(args: CustomDataArgs) {
    return this.http.delete(this.getCustomDataRoute(args))
  }
}
