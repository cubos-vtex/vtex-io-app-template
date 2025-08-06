import { SCHEMAS, TASK_ENTITY, TASK_FIELDS } from '../masterdata-setup'
import { StoreForbiddenError } from '../utils'
import {
  BaseMasterdataController,
  DEFAULT_PAGE,
  DEFAULT_PAGESIZE,
} from './base/BaseMasterdataController'

// The email is required in the task masterdata entity schema, but
// it will not be expected in the body of controller operations
// because it is taken from the session.
const TASK_REQUIRED_FIELDS = SCHEMAS[TASK_ENTITY].required.filter(
  (field) => field !== 'email'
)

const DEFAULT_SORT = 'createdIn'
const DEFAULT_DIRECTION = 'asc'

export class TaskMasterdataController extends BaseMasterdataController<Task> {
  constructor(ctx: Context) {
    super(ctx, TASK_ENTITY, TASK_FIELDS)
  }

  private async getTaskFieldsFromBody(requiredFields?: string[]) {
    // The email will not be expected in the body. It will be taken from the session.
    return this.getBodyFields<Omit<Task, 'email'>>(requiredFields)
  }

  private getIdParam() {
    return this.getPathParam('id')
  }

  public async get(inputId?: string) {
    const storeUserEmail = await this.getStoreUserEmail()
    const id = inputId ?? this.getIdParam()
    const task = await this.getDocument(id)

    if (task.email !== storeUserEmail) {
      throw new StoreForbiddenError()
    }

    return task
  }

  public async create(inputFields?: SaveTaskInput) {
    const storeUserEmail = await this.getStoreUserEmail()
    const fields =
      inputFields ?? (await this.getTaskFieldsFromBody(TASK_REQUIRED_FIELDS))

    return this.createDocument({ ...fields, email: storeUserEmail })
  }

  public async update(inputFields?: SaveTaskInput) {
    const current = await this.get(inputFields?.id)
    const fields = inputFields ?? (await this.getTaskFieldsFromBody())
    const newFields = { ...current, ...fields }

    await this.updatePartialDocument(current.id, newFields)

    return newFields
  }

  public async delete(inputId?: string) {
    const toBeDeleted = await this.get(inputId)

    await this.deleteDocument(toBeDeleted.id)

    return toBeDeleted
  }

  public async search(searchInput?: SearchInput) {
    const storeUserEmail = await this.getStoreUserEmail()
    const conditions = [`email=${storeUserEmail}`]
    const {
      search,
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PAGESIZE,
      sort = DEFAULT_SORT,
      direction = DEFAULT_DIRECTION,
    } = searchInput ?? {
      ...this.getMasterdataSearchQuery(),
      ...this.getQueryStringParams(['search'] as const),
    }

    const searchWithWildcards = search
      ?.trim()
      ?.replace(/["*]/g, '')
      ?.split(/\s+/)
      .join('*')

    if (searchWithWildcards) {
      conditions.push(
        `(title="*${searchWithWildcards}*" OR description="*${searchWithWildcards}*")`
      )
    }

    const pagination = { page, pageSize }
    const where = conditions.join(' AND ')
    const sortOption = `${sort} ${direction}`

    return this.searchDocumentsWithPaginationInfo(pagination, where, sortOption)
  }
}
