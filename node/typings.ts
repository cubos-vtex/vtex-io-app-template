import type { RecorderState, ServiceContext } from '@vtex/api'

import type { Clients } from './clients'
import type {
  AppSettingsController,
  GithubController,
  TaskMasterdataController,
} from './controllers'

declare global {
  type Context = ServiceContext<
    Clients,
    RecorderState & {
      storeUserEmail?: string
      appSettingsController: AppSettingsController
      githubController: GithubController
      taskMasterdataController: TaskMasterdataController
    }
  >

  type NextFn = () => Promise<void>

  type Handler = (ctx: Context, next?: NextFn) => Promise<void>

  type AppSettings = { schemaHash: string }

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

  type MasterdataInternalFields = {
    id: string
    createdIn: string
    lastInteractionIn: string
  }

  type Task = MasterdataInternalFields & {
    email: string
    title: string
    description: string
  }
}
