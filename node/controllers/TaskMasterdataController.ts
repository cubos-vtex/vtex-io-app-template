import {
  TASK_ENTITY,
  TASK_FIELDS,
  TASK_REQUIRED_FIELDS,
} from '../masterdata-setup'
import { BaseMasterdataController } from './base/BaseMasterdataController'

export class TaskMasterdataController extends BaseMasterdataController<Task> {
  constructor(ctx: Context) {
    super(ctx, TASK_ENTITY, TASK_FIELDS)
  }

  private async getTaskFields(requiredFields?: string[]) {
    return this.getBodyFields<Task>(requiredFields)
  }

  private getIdParam() {
    return this.getPathParam('id')
  }

  public async get() {
    const id = this.getIdParam()

    return this.getDocument(id)
  }

  public async create() {
    const fields = await this.getTaskFields(TASK_REQUIRED_FIELDS)

    return this.createDocument(fields)
  }

  public async update() {
    const id = this.getIdParam()
    const fields = await this.getTaskFields()

    return this.updatePartialDocument(id, fields)
  }

  public async delete() {
    const id = this.getIdParam()

    return this.deleteDocument(id)
  }

  public async search() {
    const {
      sort = 'createdIn desc',
      where,
      pagination,
    } = this.getMasterdataSearchQuery()

    return this.searchDocumentsWithPaginationInfo(pagination, where, sort)
  }
}
