import { TASK_ENTITY, TASK_FIELDS } from '../masterdata-setup'
import { throwForbiddenError } from '../utils'
import { BaseMasterdataController } from './base/BaseMasterdataController'

const TASK_REQUIRED_FIELDS = ['title', 'description']

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
      throwForbiddenError()
    }

    return task
  }

  public async create() {
    const storeUserEmail = await this.getStoreUserEmail()
    const fields = await this.getTaskFields(TASK_REQUIRED_FIELDS)

    return this.createDocument({ ...fields, email: storeUserEmail })
  }

  public async update() {
    const task = await this.get()
    const fields = await this.getTaskFields()
    const newFields = { ...task, ...fields }

    await this.updatePartialDocument(task.id, newFields)

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
    const cleanSearch = search?.replace(/"/g, '')

    if (cleanSearch) {
      conditions.push(
        `(title="*${cleanSearch}*" OR description="*${cleanSearch}*")`
      )
    }

    const where = conditions.join(' AND ')

    return this.searchDocumentsWithPaginationInfo(pagination, where, sort)
  }
}
