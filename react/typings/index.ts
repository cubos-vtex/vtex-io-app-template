export type ApiResponse = {
  code?: string
  message?: string
  response?: { data?: Record<string, unknown> & { error?: string } }
}

export type ApitRequestInput = {
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

export type GitHubRepositoriesApiResponse = ApiResponse &
  GitHubOrganizationRepositories

export type GetGitHubRepositoriesQuery = {
  getGitHubRepositoriesByOrg: GitHubOrganizationRepositories
}

export type GetGitHubRepositoriesArgs = {
  org: string
  sort?: string
  direction?: string
}
