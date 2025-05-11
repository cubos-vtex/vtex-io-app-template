import { BaseController } from './base/BaseController'

export class GithubController extends BaseController {
  private getSearchParams() {
    const org = this.getPathParam('org')

    const {
      sort = 'full_name',
      direction = 'asc',
    } = this.getQueryStringParams(['sort', 'direction'] as const)

    return { org, sort, direction }
  }

  public async getRepositoriesByOrg() {
    const { org, sort, direction } = this.getSearchParams()

    return this.ctx.clients.github.getRepositoriesByOrg(org, {
      sort,
      direction,
    })
  }
}
