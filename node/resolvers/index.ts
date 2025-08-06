import * as schemaDirectives from './directives'
import * as Mutation from './mutations'
import * as Query from './queries'

export default {
  resolvers: {
    Query,
    Mutation,
  },
  schemaDirectives,
}
