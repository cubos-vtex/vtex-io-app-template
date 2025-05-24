import type { ParsedUrlQuery } from 'querystring'

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient, NotFoundError, TooManyRequestsError } from '@vtex/api'

import { repositoriesConverter } from './transformers'

const GET_REPOSITORIES_PAGE_SIZE = 100

export class Github extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('https://api.github.com', ctx, {
      ...options,
      // adding headers needed for this external API
      headers: {
        ...options?.headers,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
  }

  private async getRepositoriesByOrgAndPage(
    org: string,
    query: ParsedUrlQuery,
    page = 1
  ) {
    const params = {
      per_page: GET_REPOSITORIES_PAGE_SIZE.toString(),
      page: page.toString(),
      ...query,
    }

    return this.http
      .get<Repository[]>(`/orgs/${org}/repos`, {
        params,
        metric: 'get-org-repositories',
      })
      .catch((e) => {
        switch (e.response?.status) {
          case 403:
            throw new TooManyRequestsError(
              'GiHub API rate limit exceeded. Try again later.'
            )

          case 404:
            throw new NotFoundError(`Organization ${org} not found.`)

          default:
            throw e
        }
      })
  }

  public async getRepositoriesByOrg(
    org: string,
    query: ParsedUrlQuery
  ): Promise<GetOrgRepositoriesResponse> {
    const repositories: Repository[] = []

    const next = async (page = 1) => {
      const pageRepositories = await this.getRepositoriesByOrgAndPage(
        org,
        query,
        page
      )

      repositories.push(...pageRepositories)

      if (pageRepositories.length < GET_REPOSITORIES_PAGE_SIZE) return

      await next(page + 1)
    }

    await next()

    if (!repositories.length) {
      return { org: { name: org }, repositories: [] }
    }

    return repositoriesConverter(repositories)
  }
}
