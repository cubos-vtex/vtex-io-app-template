import React, { useRef, useState } from 'react'
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
import { useTasks } from './components/tasks/hooks'
import { withQueryClient } from './service'
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
  const taskId = query?.id

  const clearTaskForm = () => {
    setQuery({ ...query, id: undefined })

    if (titleRef.current && descriptionRef.current) {
      titleRef.current.value = ''
      descriptionRef.current.value = ''
    }
  }

  const {
    searchTasksQuery,
    getTaskQuery,
    addTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  } = useTasks({
    taskId,
    search: searchDebounced,
    onAddTaskSuccess: clearTaskForm,
    onGetTaskSuccess(data) {
      if (titleRef.current && descriptionRef.current) {
        titleRef.current.value = data.title
        descriptionRef.current.value = data.description
      }
    },
    onDeleteTaskSuccess(data) {
      clearTaskForm()

      showToast({
        message: formatMessage(messages.tasksDeletedLabel, {
          title: <strong key={data.id}>{data.title}</strong>,
        }),
        duration: UNDO_DELETE_TIMEOUT,
        action: {
          label: formatMessage(messages.tasksUndoLabel),
          onClick: () => addTaskMutation.mutate(data),
        },
      })
    },
  })

  const currentTask = getTaskQuery.data

  if (searchTasksQuery.isInitialLoading) {
    return <Layout pageHeader={<PageHeader title={<Spinner />} />} />
  }

  const { error: searchError } = searchTasksQuery

  if (searchError?.message === messages.notAuthenticatedError.id) {
    return (
      <Layout
        pageHeader={<PageHeader title={<AlertError error={searchError} />} />}
      />
    )
  }

  const isLoading =
    (taskId && getTaskQuery.isLoading) ||
    searchTasksQuery.isFetching ||
    addTaskMutation.isLoading ||
    updateTaskMutation.isLoading ||
    deleteTaskMutation.isLoading

  const tasks = searchTasksQuery.data?.data
  const isEmpty = !searchTasksQuery.isFetching && !searchError && !tasks?.length

  const handleSaveTask = () => {
    const title = titleRef.current?.value
    const description = descriptionRef.current?.value

    if (title && description) {
      if (currentTask) {
        updateTaskMutation.mutate({ id: currentTask.id, title, description })
      } else {
        addTaskMutation.mutate({ title, description })
      }
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
    deleteTaskMutation.mutate(id)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value

    setInputSearch(newSearch)
    setQuery({ search: newSearch || undefined })
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
            />
          </div>
        </div>

        {searchError && <AlertError error={searchError} />}

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
                      isLoading={
                        deleteTaskMutation.isLoading &&
                        deleteTaskMutation.variables === task.id
                      }
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
