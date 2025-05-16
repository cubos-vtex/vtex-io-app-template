import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import {
  Button,
  ButtonWithIcon,
  Card,
  IconDelete,
  Input,
  Layout,
  PageBlock,
  PageHeader,
  Spinner,
  Textarea,
} from 'vtex.styleguide'

import { AlertError } from './components/common'
import { useToast } from './components/common/hooks'
import { useTasks } from './components/tasks/hooks'
import { withQueryClient } from './service'
import messages from './utils/messages'

function Tasks() {
  const { formatMessage } = useIntl()
  const titleRef = useRef<HTMLInputElement>()
  const descriptionRef = useRef<HTMLTextAreaElement>()
  const { showToast } = useToast()

  const { searchTasksQuery, addTaskMutation, deleteTaskMutation } = useTasks({
    onAddTaskSuccess() {
      if (titleRef.current) titleRef.current.value = ''
      if (descriptionRef.current) descriptionRef.current.value = ''
    },
    onDeleteTaskSuccess(data) {
      showToast({
        message: formatMessage(messages.tasksDeletedLabel, {
          title: <strong key={data.id}>{data.title}</strong>,
        }),
        duration: 10000,
        action: {
          label: formatMessage(messages.tasksUndoLabel),
          onClick: () => addTaskMutation.mutate(data),
        },
      })
    },
  })

  const { error: searchError } = searchTasksQuery

  if (searchTasksQuery.isInitialLoading) {
    return <Layout pageHeader={<PageHeader title={<Spinner />} />} />
  }

  if (searchError?.message === messages.notAuthenticatedError.id) {
    return (
      <Layout
        pageHeader={<PageHeader title={<AlertError error={searchError} />} />}
      />
    )
  }

  const disabled =
    searchTasksQuery.isLoading ||
    addTaskMutation.isLoading ||
    deleteTaskMutation.isLoading

  const tasks = searchTasksQuery.data?.data

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
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>
        <div className="flex justify-center mb6">
          <Button
            onClick={handleAddTask}
            isLoading={addTaskMutation.isLoading}
            disabled={disabled}
          >
            {formatMessage(messages.tasksButtonAddLabel)}
          </Button>
        </div>

        {searchError && <AlertError error={searchError} />}

        {searchTasksQuery.isLoading && <Spinner />}

        {!searchTasksQuery.isLoading &&
          !searchError &&
          !tasks?.length &&
          formatMessage(messages.tasksEmptyLabel)}

        {!searchTasksQuery.isLoading && !!tasks?.length && (
          <div className="flex flex-wrap justify-center">
            {tasks.map((task) => (
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
        )}
      </PageBlock>
    </Layout>
  )
}

export default withQueryClient(Tasks)
