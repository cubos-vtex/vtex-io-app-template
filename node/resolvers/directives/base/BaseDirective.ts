import type { GraphQLField, GraphQLResolveInfo } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export abstract class BaseDirective extends SchemaDirectiveVisitor {
  abstract process(
    ctx: Context,
    root?: unknown,
    args?: Record<string, unknown>,
    info?: GraphQLResolveInfo
  ): Promise<void>

  public visitFieldDefinition(
    field: GraphQLField<unknown, Context, Record<string, unknown>>
  ) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (...params) => {
      const [root, args, ctx, info] = params

      await this.process(ctx, root, args, info)

      return resolve(root, args, ctx, info)
    }
  }
}
