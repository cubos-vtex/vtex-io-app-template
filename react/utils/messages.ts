import { defineMessages } from 'react-intl'

/**
 * Defines a set of localized messages for the application.
 */
export default defineMessages({
  // defining site editor messages to avoid warnings
  editorListRepositoriesTitle: { id: 'admin/editor.list-repositories.title' },
  editorListRepositoriesDescription: {
    id: 'admin/editor.list-repositories.description',
  },
  editorListRepositoriesPropDefaultOrgTitle: {
    id: 'admin/editor.list-repositories.props.default-org.title',
  },
  editorListRepositoriesPropDefaultOrgDescription: {
    id: 'admin/editor.list-repositories.props.default-org.description',
  },

  // general messages
  notAuthenticatedError: { id: 'store/not-authenticated-error' },
  searchLabel: { id: 'store/search.label' },

  // search input
  inputLabel: { id: 'store/list-repositories.input.label' },
  inputPlaceholder: { id: 'store/list-repositories.input.placeholder' },

  // list repositories
  listRepositoriesTitle: { id: 'store/list-repositories.title' },
  listRepositoriesEmptyLabel: { id: 'store/list-repositories.empty.label' },

  // sort options
  sortPlaceholder: { id: 'store/list-repositories.sort.placeholder' },
  sortNameLabel: { id: 'store/list-repositories.sort.name.label' },
  sortCreatedLabel: { id: 'store/list-repositories.sort.created.label' },
  sortUpdatedLabel: { id: 'store/list-repositories.sort.updated.label' },
  sortPushedLabel: { id: 'store/list-repositories.sort.pushed.label' },

  // direction options
  directionPlaceholder: { id: 'store/list-repositories.direction.placeholder' },
  directionAscLabel: { id: 'store/list-repositories.direction.asc.label' },
  directionDescLabel: { id: 'store/list-repositories.direction.desc.label' },

  // sort and direction update button
  sortDirectionButtonLabel: {
    id: 'store/list-repositories.sort-direction.button.label',
  },

  // tasks CRUD
  tasksTitle: { id: 'store/tasks.title' },
  tasksInputTitleLabel: { id: 'store/tasks.input.title.label' },
  tasksInputTitlePlaceholder: { id: 'store/tasks.input.title.placeholder' },
  tasksInputDescriptionLabel: { id: 'store/tasks.input.description.label' },
  tasksInputDescriptionPlaceholder: {
    id: 'store/tasks.input.description.placeholder',
  },
  tasksButtonAddLabel: { id: 'store/tasks.button.add.label' },
  tasksEmptyLabel: { id: 'store/tasks.empty.label' },
  tasksRequiredLabel: { id: 'store/tasks.required.label' },
  tasksDeletedLabel: { id: 'store/tasks.deleted.label' },
  tasksUndoLabel: { id: 'store/tasks.undo.label' },
})
