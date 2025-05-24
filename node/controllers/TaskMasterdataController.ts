import { SCHEMAS, TASK_ENTITY, TASK_FIELDS } from '../masterdata-setup'
import { StoreForbiddenError } from '../utils'
import { BaseMasterdataController } from './base/BaseMasterdataController'

// The email is required in the task masterdata entity schema, but
// it will not be expected in the body of controller operations
// because it is taken from the session.
const TASK_REQUIRED_FIELDS = SCHEMAS.task.body.required.filter(
  (field) => field !== 'email'
)

export class TaskMasterdataController extends BaseMasterdataController<Task> {
  constructor(ctx: Context) {
    super(ctx, TASK_ENTITY, TASK_FIELDS)
  }

  private async getTaskFields(requiredFields?: string[]) {
    // The email will not be expected in the body. It will be taken from the session.
    return this.getBodyFields<Omit<Task, 'email'>>(requiredFields)
  }

  private getIdParam() {
    return this.getPathParam('id')
  }

  public async get() {
    const storeUserEmail = await this.getStoreUserEmail()
    const id = this.getIdParam()
    const task = await this.getDocument(id)

    if (task.email !== storeUserEmail) {
      throw new StoreForbiddenError()
    }

    return task
  }

  public async create() {
    const storeUserEmail = await this.getStoreUserEmail()
    const fields = await this.getTaskFields(TASK_REQUIRED_FIELDS)

    return this.createDocument({ ...fields, email: storeUserEmail })
  }

  public async update() {
    const current = await this.get()
    const fields = await this.getTaskFields()
    const newFields = { ...current, ...fields }

    await this.updatePartialDocument(current.id, newFields)

    return newFields
  }

  public async delete() {
    const toBeDeleted = await this.get()

    await this.deleteDocument(toBeDeleted.id)

    return toBeDeleted
  }

  public async search() {
    const storeUserEmail = await this.getStoreUserEmail()

    const {
      sort = 'createdIn desc',
      pagination,
    } = this.getMasterdataSearchQuery()

    const conditions = [`email=${storeUserEmail}`]
    const { search } = this.getQueryStringParams(['search'] as const)
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

    const where = conditions.join(' AND ')

    return this.searchDocumentsWithPaginationInfo(pagination, where, sort)
  }
}
