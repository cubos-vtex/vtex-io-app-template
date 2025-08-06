import { checkSchemas, checkStoreUser, setupControllers } from '../../utils'
import { BaseDirective } from './base/BaseDirective'

export class CheckSchemas extends BaseDirective {
  public process(ctx: Context) {
    return checkSchemas(ctx)
  }
}

export class CheckStoreUser extends BaseDirective {
  public process(ctx: Context) {
    return checkStoreUser(ctx)
  }
}

export class SetupControllers extends BaseDirective {
  public process(ctx: Context) {
    return setupControllers(ctx)
  }
}
