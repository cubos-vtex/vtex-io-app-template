import type { ServiceContext } from '@vtex/api'

import type { Clients } from './clients'

declare global {
  type Context = ServiceContext<Clients>

  type Repository = {
    owner: {
      login: string
      avatar_url: string
    }
    html_url: string
    name: string
    description: string
    visibility: 'public' | 'private'
  }

  type GetOrgRepositoriesResponse = {
    org: {
      name: string
      avatarUrl?: string
    }
    repositories: Array<
      Pick<Repository, 'name' | 'description'> & {
        url: string
      }
    >
  }

  type GetOrgRepositoriesArgs = {
    org: string
    sort?: string
    direction?: string
  }
}
