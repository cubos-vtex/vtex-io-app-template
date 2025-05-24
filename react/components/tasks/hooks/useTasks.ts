import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

import { apiRequestFactory } from '../../../service'
import type {
  InputTask,
  SearchMasterdataResponse,
  Task,
} from '../../../typings'
import { useToast } from '../../common/hooks'

const BASE_URL = '/_v/<APP_NAME>/tasks'

type Props<T> = {
  search?: string
  onAddTaskSuccess?: (data: T) => void
  onDeleteTaskSuccess?: (data: T) => void
}

// Consuming backend route with useQuery and useMutation hooks of @tanstack/react-query.
export function useTasks<T = Task>(props?: Props<T>) {
  const { showToast } = useToast()
  const { formatMessage } = useIntl()
  const search = props?.search ?? ''

  const { refetch, ...searchTasksQuery } = useQuery<
    SearchMasterdataResponse<T>,
    Error
  >({
    keepPreviousData: true,
    queryKey: ['tasks', search],
    queryFn: apiRequestFactory({ url: BASE_URL, query: { search } }),
  })

  const refetchAfterDelay = () => window.setTimeout(refetch, 500)

  const onMutationError = useCallback(
    ({ message }: Error) => {
      showToast(formatMessage({ id: message, defaultMessage: message }))
    },
    [formatMessage, showToast]
  )

  return {
    searchTasksQuery: { refetch, ...searchTasksQuery },

    addTaskMutation: useMutation<T, Error, InputTask>({
      mutationFn: async (task) =>
        apiRequestFactory<T>({
          url: BASE_URL,
          method: 'POST',
          body: task,
        })(),
      onError: onMutationError,
      onSuccess: (data) => {
        props?.onAddTaskSuccess?.(data)
        refetchAfterDelay()
      },
    }),

    deleteTaskMutation: useMutation<T, Error, string>({
      mutationFn: async (id) =>
        apiRequestFactory<T>({
          url: `${BASE_URL}/${id}`,
          method: 'DELETE',
        })(),
      onError: onMutationError,
      onSuccess: (data) => {
        props?.onDeleteTaskSuccess?.(data)
        refetchAfterDelay()
      },
    }),
  }
}
