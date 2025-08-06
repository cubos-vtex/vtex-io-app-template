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

const SEARCH_DELAY = 1500
const UNDO_DELETE_DELAY = 10000

function Tasks() {
  const { formatMessage } = useIntl()
  const titleRef = useRef<HTMLInputElement>()
  const descriptionRef = useRef<HTMLTextAreaElement>()
  const { showToast } = useToast()
  const { query, setQuery } = useRuntime()
  const [inputSearch, setInputSearch] = useState(query?.search)
  const searchDebounced = useDebounce(inputSearch, SEARCH_DELAY)

  const { searchTasksQuery, addTaskMutation, deleteTaskMutation } = useTasks({
    search: searchDebounced,
    onAddTaskSuccess() {
      if (titleRef.current) titleRef.current.value = ''
      if (descriptionRef.current) descriptionRef.current.value = ''
    },
    onDeleteTaskSuccess(data) {
      showToast({
        message: formatMessage(messages.tasksDeletedLabel, {
          title: <strong key={data.id}>{data.title}</strong>,
        }),
        duration: UNDO_DELETE_DELAY,
        action: {
          label: formatMessage(messages.tasksUndoLabel),
          onClick: () => addTaskMutation.mutate(data),
        },
      })
    },
  })

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
    searchTasksQuery.isFetching ||
    addTaskMutation.isLoading ||
    deleteTaskMutation.isLoading

  const tasks = searchTasksQuery.data?.data
  const isEmpty = !searchTasksQuery.isFetching && !searchError && !tasks?.length

  const handleAddTask = () => {
    const title = titleRef.current?.value
    const description = descriptionRef.current?.value

    if (title && description) {
      addTaskMutation.mutate({ title, description })
    } else {
      showToast(formatMessage(messages.tasksRequiredLabel))
    }
  }

  const handleDeleteTask = (id: string) => deleteTaskMutation.mutate(id)

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
            onClick={handleAddTask}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {formatMessage(messages.tasksButtonAddLabel)}
          </Button>
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
              href={`#${task.id}`}
              key={task.id}
              className="bw2 br2 b--solid b--transparent hover-b--action-primary ma2 no-underline"
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
                      onClick={() => handleDeleteTask(task.id)}
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
