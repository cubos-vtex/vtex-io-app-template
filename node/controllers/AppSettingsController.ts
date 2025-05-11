import { BaseController } from './base/BaseController'

const SETTINGS_VBASE_KEY = 'settings'
const DEFAULT_SETTINGS: AppSettings = { schemaHash: '' }

export class AppSettingsController extends BaseController {
  private readonly appSettings = this.ctx.clients.appSettings

  public async get() {
    const settings = await this.appSettings.get(SETTINGS_VBASE_KEY, true)

    return settings ?? DEFAULT_SETTINGS
  }

  public async save(settings: AppSettings) {
    return this.appSettings.save(SETTINGS_VBASE_KEY, settings)
  }
}
