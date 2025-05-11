export const TASK_ENTITY = 'task'
export const SCHEMA_VERSION = 'v0.0.1'
export const SCHEMAS = {
  task: {
    name: TASK_ENTITY,
    body: {
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['name', 'description'],
      'v-indexed': ['name', 'description'],
      'v-immediate-indexing': true,
      'v-cache': false,
    },
  },
}

const INTERNAL_FIELDS = ['id', 'createdIn', 'lastInteractionIn']

export const TASK_FIELDS = [
  ...INTERNAL_FIELDS,
  ...Object.keys(SCHEMAS.task.body.properties),
]

export const TASK_REQUIRED_FIELDS = SCHEMAS.task.body.required
