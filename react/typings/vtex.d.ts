declare module '*.gql' {
  import type { DocumentNode } from 'graphql'

  const Schema: DocumentNode

  export default Schema
}

declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'

  const schema: DocumentNode

  export default schema
}

declare module '*.css' {
  type Styles = {
    [selector: string]: string
  }

  const styles: Styles

  export default styles
}

declare module 'vtex.styleguide'
