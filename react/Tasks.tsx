import React, { useRef } from 'react'
import {
  Alert,
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

import { useToast } from './components/common/hooks'
import { useTasks } from './components/tasks/hooks'
import { withQueryClient } from './service'

function Tasks() {
  const nameRef = useRef<HTMLInputElement>()
  const descriptionRef = useRef<HTMLTextAreaElement>()
  const { showToast } = useToast()

  const { searchTasksQuery, addTaskMutation, deleteTaskMutation } = useTasks({
    onAddTaskSuccess() {
      if (nameRef.current) nameRef.current.value = ''
      if (descriptionRef.current) descriptionRef.current.value = ''
    },
    onDeleteTaskSuccess(data) {
      showToast({
        message: (
          <>
            A task <strong>{data?.name}</strong> foi excluída
          </>
        ),
        duration: 10000,
        action: {
          label: 'Desfazer',
          onClick: () => addTaskMutation.mutate(data),
        },
      })
    },
  })

  const error =
    searchTasksQuery.error ?? addTaskMutation.error ?? deleteTaskMutation.error

  const disabled =
    searchTasksQuery.isLoading ||
    addTaskMutation.isLoading ||
    deleteTaskMutation.isLoading

  const tasks = searchTasksQuery.data?.data

  const handleAddTask = () => {
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value

    if (name && description) {
      addTaskMutation.mutate({ name, description })
    } else {
      showToast('Título e descrição são obrigatórios')
    }
  }

  const handleDeleteTask = (id: string) => deleteTaskMutation.mutate(id)

  return (
    <Layout pageHeader={<PageHeader title="Lista de Tarefas" />}>
      <PageBlock>
        <div className="mb4">
          <Input
            required
            ref={nameRef}
            placeholder="Escreva um título para a tarefa"
            label="Título"
            disabled={disabled}
          />
        </div>
        <div className="mb4">
          <Textarea
            required
            size="small"
            ref={descriptionRef}
            placeholder="Escreva uma descrição para a tarefa"
            label="Descrição"
            disabled={disabled}
          />
        </div>
        <div className="flex justify-center mb6">
          <Button
            onClick={handleAddTask}
            isLoading={addTaskMutation.isLoading}
            disabled={disabled}
          >
            Adicionar tarefa
          </Button>
        </div>

        {error && <Alert type="error">{error.message}</Alert>}

        {searchTasksQuery.isLoading && <Spinner />}

        {!searchTasksQuery.isLoading &&
          !error &&
          !tasks?.length &&
          'Nenhuma tarefa encontrada'}

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
                    <span className="fw6">{task.name}</span>
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
