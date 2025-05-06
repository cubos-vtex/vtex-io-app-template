import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FC } from 'react'
import React from 'react'

import type { ApiResponse, ApitRequestInput } from '../typings'

/**
 * A list of error patterns that indicate retryable errors.
 * These patterns are used to identify specific error messages
 * that should trigger a retry mechanism for the API requests.
 */
const ERROR_RETRY_PATTERNS = ['unhealthy', 'genericerror', 'connection refused']

/**
 * The maximum number of retry attempts for the API requests after errors.
 * This constant is used to limit the number of retries to prevent
 * infinite loops or excessive resource usage.
 */
const ERROR_MAX_RETRIES = 5

/**
 * Creates a new instance of `QueryClient` with customized default options for queries.
 *
 * - `refetchOnWindowFocus`: Disabled to prevent automatic refetching when the window regains focus.
 * - `retry`: A custom retry logic that determines whether a failed query should be retried.
 *    - Logs the error message and failure count to the console.
 *    - Retries the query if the failure count is below `ERROR_MAX_RETRIES` and the error message
 *      matches any pattern in `ERROR_RETRY_PATTERNS`.
 */
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
          failureCount < ERROR_MAX_RETRIES &&
          ERROR_RETRY_PATTERNS.some((pattern) =>
            e.message.toLowerCase().includes(pattern)
          )

        return shouldRetry
      },
    },
  },
})

/**
 * A higher-order component (HOC) that wraps a given React functional component
 * with a `QueryClientProvider` to provide a React Query client context.
 *
 * @template P - The props type of the wrapped component.
 * @template S - The schema type of the wrapped component, if any.
 *
 * @param Component - The React functional component to be wrapped. It may optionally
 * have a `schema` property.
 *
 * @returns A new component that renders the given component within a `QueryClientProvider`.
 * The `schema` property of the original component is preserved.
 */
export function withQueryClient<P, S>(Component: FC<P> & { schema?: S }) {
  const QueryClientWrappedComponent: typeof Component = (props) => (
    <QueryClientProvider client={queryClient}>
      {<Component {...props} />}
    </QueryClientProvider>
  )

  QueryClientWrappedComponent.schema = Component.schema

  return QueryClientWrappedComponent
}

/**
 * Factory function to create an API request handler.
 *
 * This function generates an asynchronous function that performs an HTTP request
 * using the provided configuration. It supports query parameters, custom headers,
 * and request bodies. The response is parsed as JSON and returned. If the request
 * fails or the response status is not OK, an error is thrown with a detailed message.
 *
 * @template T - The expected type of the API response.
 *
 * @param {ApitRequestInput} params - The input parameters for the API request.
 * @param {string} params.url - The URL of the API endpoint.
 * @param {string} [params.method='GET'] - The HTTP method to use for the request.
 * @param {Record<string, string>} [params.query={}] - An object representing query parameters.
 * @param {Record<string, string>} [params.headers] - An object representing custom headers.
 * @param {unknown} [params.body] - The body of the request, if applicable.
 *
 * @returns {() => Promise<T>} An asynchronous function that performs the API request
 * and returns the parsed JSON response of type `T`.
 *
 * @throws {Error} Throws an error if the request fails or the response status is not OK.
 */
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
