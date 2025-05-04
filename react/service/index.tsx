import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FC } from 'react'
import React from 'react'

import type { ApiResponse, ApitRequestInput } from '../typings'

const ERROR_RETRY_PATTERNS = ['unhealthy', 'genericerror', 'connection refused']

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const e = error as Error

        console.error('Request Error:', {
          errorMessage: e.message,
          failureCount,
        })

        const shouldRetry =
          failureCount < 10 &&
          ERROR_RETRY_PATTERNS.some((pattern) =>
            e.message.toLowerCase().includes(pattern)
          )

        return shouldRetry
      },
    },
  },
})

export function withQueryClient<P>(Component: FC<P>) {
  const QueryClientWrappedComponent: FC<P> = (props) => (
    <QueryClientProvider client={queryClient}>
      {<Component {...props} />}
    </QueryClientProvider>
  )

  return QueryClientWrappedComponent
}

export function apiRequestFactory<T extends ApiResponse>({
  url,
  method = 'GET',
  query = {},
  headers,
  body,
}: ApitRequestInput) {
  const queryParams = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return async function apiRequest() {
    const response = await fetch(url.concat('?', queryParams), {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    }).catch((e) => {
      const args = JSON.stringify({ url, method, query, headers, body })

      throw new Error(`Request failed with args ${args}:\n${e.toString()}`)
    })

    const json: T = await response.json()

    if (!response.ok) {
      throw new Error(
        typeof json?.response?.data === 'string'
          ? json.response.data
          : typeof json?.response?.data === 'object' && json.response.data.error
          ? json.response.data.error
          : json?.message ??
            json?.code ??
            `${response.status.toString()}${
              response.statusText ? `: ${response.statusText}` : ''
            }`
      )
    }

    return json
  }
}
