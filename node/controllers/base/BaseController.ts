import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

type Fields = Record<string, unknown>
type QueryObject<T extends string[]> = { [K in T[number]]?: string }

export class BaseController {
  constructor(protected readonly ctx: Context) {
    this.ctx = ctx
  }

  protected getPathParam(param: string) {
    const value = this.ctx.vtex.route.params[param]
    const errorPrefix = 'Path param is'

    if (!value) {
      throw new UserInputError(`${errorPrefix} missing: ${param}`)
    }

    if (Array.isArray(value)) {
      throw new UserInputError(`${errorPrefix} invalid: ${param}`)
    }

    return value
  }

  protected getQueryStringParams<T extends string[]>(keys: T) {
    const query: QueryObject<T> = {}
    const errors: string[] = []

    for (const key of keys) {
      const value = this.ctx.query[key]

      if (Array.isArray(value)) {
        errors.push(key)
        continue
      }

      query[key as T[number]] = value
    }

    if (errors.length) {
      throw new UserInputError(
        `Invalid query string params: ${errors.join(', ')}`
      )
    }

    return query
  }

  protected async getBodyFields<T extends Fields = Fields>(
    requiredFields?: Array<keyof Fields>
  ) {
    const fields: T = await json(this.ctx.req)

    if (requiredFields?.length) {
      const fieldKeys = Object.keys(fields)

      const missingFields = requiredFields.filter(
        (requiredField) => !fieldKeys.includes(requiredField)
      )

      if (missingFields.length) {
        const errorLabel = missingFields.length > 1 ? 'fields are' : 'field is'
        const errorDetails = missingFields.join(', ')

        throw new UserInputError(
          `Required ${errorLabel} missing in the request body: ${errorDetails}`
        )
      }
    }

    return fields
  }
}
