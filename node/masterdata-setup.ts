export const TASK_ENTITY = 'task'
export const SCHEMA_VERSION = 'v0.0.1'
export const SCHEMAS = {
  task: {
    name: TASK_ENTITY,
    // The body folows the JSON Schema for Master Data v2:
    // https://developers.vtex.com/docs/guides/working-with-json-schemas-in-master-data-v2
    body: {
      properties: {
        email: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['email', 'title', 'description'],
      // All searchable fields must be in v-indexed.
      'v-indexed': ['email', 'title', 'description'],
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
