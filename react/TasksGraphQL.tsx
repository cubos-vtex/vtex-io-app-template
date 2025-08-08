import { NetworkStatus } from 'apollo-client/core/networkStatus'
import React, { useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import {
  Button,
  ButtonWithIcon,
  Card,
  IconDelete,
  Input,
  InputSearch,
  Layout,
  PageBlock,
  PageHeader,
  Spinner,
  Textarea,
} from 'vtex.styleguide'

import { AlertError } from './components/common'
import { useDebounce, useToast } from './components/common/hooks'
import DELETE_TASK_MUTATION from './graphql/deleteTask.graphql'
import TASK_QUERY from './graphql/getTask.graphql'
import TASKS_QUERY from './graphql/getTasks.graphql'
import SAVE_TASK_MUTATION from './graphql/saveTask.graphql'
import { withQueryClient } from './service'
import type {
  DeleteTaskMutation,
  GetTaskArgs,
  GetTaskQuery,
  GetTasksArgs,
  GetTasksQuery,
  SaveTaskArgs,
  SaveTaskMutation,
} from './typings'
import messages from './utils/messages'

const SEARCH_TIMEOUT = 1500
const UNDO_DELETE_TIMEOUT = 10000

function Tasks() {
  const { formatMessage } = useIntl()
  const titleRef = useRef<HTMLInputElement>()
  const descriptionRef = useRef<HTMLTextAreaElement>()
  const { showToast } = useToast()
  const { query, setQuery } = useRuntime()
  const [inputSearch, setInputSearch] = useState(query?.search)
  const searchDebounced = useDebounce(inputSearch, SEARCH_TIMEOUT)
  const [deletingTask, setDeletingTask] = useState<string | undefined>()
  const taskId = query?.id

  const {
    data: getTaskData,
    loading: taskLoading,
    error: taskError,
  } = useQuery<GetTaskQuery, GetTaskArgs>(TASK_QUERY, {
    fetchPolicy: 'cache-and-network',
    skip: !titleRef.current || !descriptionRef.current || !taskId,
    ssr: false,
    variables: { id: taskId as string },
    onCompleted({ task }) {
      if (titleRef.current && descriptionRef.current) {
        titleRef.current.value = task.title
        descriptionRef.current.value = task.description
      }
    },
  })

  const currentTask = getTaskData?.task

  const clearTaskForm = () => {
    setQuery({ ...query, id: undefined })
    setDeletingTask(undefined)

    if (titleRef.current && descriptionRef.current) {
      titleRef.current.value = ''
      descriptionRef.current.value = ''
    }
  }

  const {
    data,
    loading: searchLoading,
    networkStatus: searchNetworkStatus,
    error: searchError,
    refetch,
  } = useQuery<GetTasksQuery, GetTasksArgs>(TASKS_QUERY, {
    fetchPolicy: 'cache-and-network',
    ssr: false,
    notifyOnNetworkStatusChange: true,
    variables: { input: { search: searchDebounced } },
  })

  const [saveTask, { loading: saveLoading }] = useMutation<
    SaveTaskMutation,
    SaveTaskArgs
  >(SAVE_TASK_MUTATION, {
    refetchQueries: ['GetTasks'],
    onCompleted: clearTaskForm,
  })

  const [deleteTask, { loading: deleteLoading }] = useMutation<
    DeleteTaskMutation,
    GetTaskArgs
  >(DELETE_TASK_MUTATION, {
    refetchQueries: ['GetTasks'],
    onCompleted({ deleteTask: { id, title, description } }) {
      clearTaskForm()

      showToast({
        message: formatMessage(messages.tasksDeletedLabel, {
          title: <strong key={id}>{title}</strong>,
        }),
        duration: UNDO_DELETE_TIMEOUT,
        action: {
          label: formatMessage(messages.tasksUndoLabel),
          onClick: () => {
            saveTask({ variables: { title, description } })
          },
        },
      })
    },
  })

  const isFirstLoading = searchNetworkStatus === NetworkStatus.loading

  if (isFirstLoading) {
    return <Layout pageHeader={<PageHeader title={<Spinner />} />} />
  }

  const error = searchError ?? taskError
  const errorMessage = error?.graphQLErrors?.[0]?.message

  if (errorMessage === messages.notAuthenticatedError.id) {
    return (
      <Layout
        pageHeader={
          <PageHeader title={<AlertError error={new Error(errorMessage)} />} />
        }
      />
    )
  }

  const isLoading = taskLoading || searchLoading || saveLoading || deleteLoading
  const tasks = data?.tasks.data
  const isEmpty = !searchLoading && !searchError && !tasks?.length

  const handleSaveTask = () => {
    const title = titleRef.current?.value
    const description = descriptionRef.current?.value

    if (title && description) {
      saveTask({ variables: { id: currentTask?.id, title, description } })
    } else {
      showToast(formatMessage(messages.tasksRequiredLabel))
    }
  }

  const handleClickTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setQuery({ ...query, id })
  }

  const handleDeleteTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDeletingTask(id)
    deleteTask({ variables: { id } })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value

    setInputSearch(newSearch)
    setQuery({ ...query, search: newSearch || undefined })
  }

  const handleSearchSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    refetch({ input: { search: e.target.value } })
  }

  const handleSearchClear = () => {
    refetch({ input: { search: '' } })
  }

  return (
    <Layout
      pageHeader={<PageHeader title={formatMessage(messages.tasksTitle)} />}
    >
      <PageBlock>
        <div className="mb4">
          <Input
            ref={titleRef}
            label={formatMessage(messages.tasksInputTitleLabel)}
            placeholder={formatMessage(messages.tasksInputTitlePlaceholder)}
            disabled={isLoading}
          />
        </div>
        <div className="mb4">
          <Textarea
            size="small"
            ref={descriptionRef}
            label={formatMessage(messages.tasksInputDescriptionLabel)}
            placeholder={formatMessage(
              messages.tasksInputDescriptionPlaceholder
            )}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-center mb6">
          <Button
            onClick={handleSaveTask}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {currentTask
              ? formatMessage(messages.tasksButtonUpdateLabel)
              : formatMessage(messages.tasksButtonAddLabel)}
          </Button>
          {currentTask && (
            <div className="ml4">
              <Button
                variation="secondary"
                onClick={clearTaskForm}
                disabled={isLoading}
              >
                {formatMessage(messages.cancelLabel)}
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center mb6">
          <div className="w-100 w-50-m">
            <InputSearch
              size="small"
              placeholder={formatMessage(messages.searchLabel)}
              disabled={isLoading}
              value={inputSearch}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              onClear={handleSearchClear}
            />
          </div>
        </div>

        {error && <AlertError error={error} />}

        {isEmpty && formatMessage(messages.tasksEmptyLabel)}

        <div className="flex flex-wrap justify-center">
          {tasks?.map((task) => (
            <a
              href={`?id=${task.id}`}
              onClick={(e: React.MouseEvent) => handleClickTask(e, task.id)}
              key={task.id}
              className={`bw2 br2 b--solid ma2 no-underline ${
                currentTask?.id === task.id
                  ? 'b--action-primary'
                  : 'b--transparent hover-b--muted-3'
              }`}
              style={{
                width: 200,
                wordBreak: 'break-word',
              }}
            >
              <Card>
                <div
                  className="flex flex-column justify-center tc c-action-primary hover-c-action-primary relative"
                  style={{ height: 140 }}
                >
                  <span className="fw6">{task.title}</span>
                  {!!task.description && (
                    <div
                      className="mt4 t-small c-on-base"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '4',
                        overflow: 'hidden',
                      }}
                    >
                      {task.description}
                    </div>
                  )}
                  <div className="absolute right--1 bottom--1">
                    <ButtonWithIcon
                      icon={<IconDelete />}
                      size="small"
                      variation="danger-tertiary"
                      onClick={(e: React.MouseEvent) =>
                        handleDeleteTask(e, task.id)
                      }
                      isLoading={deleteLoading && deletingTask === task.id}
                    />
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </PageBlock>
    </Layout>
  )
}

export default withQueryClient(Tasks)
