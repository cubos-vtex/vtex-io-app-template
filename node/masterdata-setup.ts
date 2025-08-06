export const TASK_ENTITY = 'task'
export const SCHEMA_VERSION = 'v0.0.1'
const MASTERDATA_INTERNAL_FIELDS = ['id', 'createdIn', 'lastInteractionIn']

export const SCHEMAS = {
  // This object contains the schemas for each data entity in the Master Data.
  // The keys of this object are the data entities, and the values are the schemas.
  //
  // Each value must follow the JSON Schema for Master Data v2:
  // https://developers.vtex.com/docs/guides/working-with-json-schemas-in-master-data-v2
  [TASK_ENTITY]: {
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
}

export const TASK_FIELDS = [
  ...MASTERDATA_INTERNAL_FIELDS,
  ...Object.keys(SCHEMAS[TASK_ENTITY].properties),
]
