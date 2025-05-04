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

export type RepositoriesData = ApiResponse & {
  org: {
    name: string
    avatarUrl?: string
  }
  repositories: Array<{
    name: string
    description: string
    url: string
  }>
}
