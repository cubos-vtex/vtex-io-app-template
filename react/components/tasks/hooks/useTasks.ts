import { useMutation, useQuery } from '@tanstack/react-query'

import { apiRequestFactory } from '../../../service'
import type {
  InputTask,
  SearchMasterdataResponse,
  Task,
} from '../../../typings'

const BASE_URL = '/_v/<APP_NAME>/tasks'

type Props<T> = {
  onAddTaskSuccess?: (data: T) => void
  onDeleteTaskSuccess?: (data: T) => void
}

// Consuming backend route with useQuery and useMutation hooks of @tanstack/react-query.
export function useTasks<T = Task>(props?: Props<T>) {
  const { refetch, ...searchTasksQuery } = useQuery<
    SearchMasterdataResponse<T>,
    Error
  >({
    queryKey: ['tasks'],
    queryFn: apiRequestFactory({ url: BASE_URL }),
  })

  const refetchAfterDelay = () => window.setTimeout(refetch, 500)

  return {
    searchTasksQuery: { refetch, ...searchTasksQuery },

    addTaskMutation: useMutation<T, Error, InputTask>({
      mutationFn: async (task) =>
        apiRequestFactory<T>({
          url: BASE_URL,
          method: 'POST',
          body: task,
        })(),
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
      onSuccess: (data) => {
        props?.onDeleteTaskSuccess?.(data)
        refetchAfterDelay()
      },
    }),
  }
}
