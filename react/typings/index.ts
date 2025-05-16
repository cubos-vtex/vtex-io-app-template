export type ApiResponse<T = unknown> = T & {
  code?: string
  message?: string
  response?: { data?: string | Record<string, string> }
}

export type ApiRequestInput = {
  url: string
  method?: string
  query?: Record<string, string>
  headers?: HeadersInit
  body?: Record<string, unknown> | string
}

export type GitHubOrganization = {
  name: string
  avatarUrl?: string
}

export type GitHubRepository = {
  name: string
  description: string
  url: string
}

export type GitHubOrganizationRepositories = {
  org: GitHubOrganization
  repositories: GitHubRepository[]
}

export type GetGitHubRepositoriesQuery = {
  getGitHubRepositoriesByOrg: GitHubOrganizationRepositories
}

export type GetGitHubRepositoriesArgs = {
  org: string
  sort?: string
  direction?: string
}

export type SearchMasterdataResponse<T> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export type Task = {
  id: string
  createdIn: string
  lastInteractionIn: string
  email: string
  title: string
  description: string
}

export type InputTask = Pick<Task, 'title' | 'description'>
