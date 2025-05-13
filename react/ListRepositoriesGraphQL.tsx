import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'
import { Alert, Layout, PageBlock, PageHeader, Spinner } from 'vtex.styleguide'

import {
  ListRepositoriesContent,
  ListRepositoriesFilters,
  ListRepositoriesPageTitle,
  ListRepositoriesSearchInput,
} from './components/list-repositories'
import { useListRepositoriesFilters } from './components/list-repositories/hooks'
import GITHUB_REPOSITORIES_QUERY from './graphql/getGitHubRepositoriesByOrg.graphql'
import type {
  GetGitHubRepositoriesArgs,
  GetGitHubRepositoriesQuery,
} from './typings'
import messages from './utils/messages'

type Props = {
  defaultOrg?: string
}

function ListRepositoriesGraphQL({ defaultOrg = '' }: Props) {
  const { formatMessage } = useIntl()
  const { DEFAULT_SORT, DEFAULT_DIRECTION } = useListRepositoriesFilters()
  const [selected, setSelected] = useState(defaultOrg)
  const [inputSort, setInputSort] = useState(DEFAULT_SORT)
  const [inputDirection, setDirection] = useState(DEFAULT_DIRECTION)
  const [filters, setFilters] = useState({
    sort: DEFAULT_SORT,
    direction: DEFAULT_DIRECTION,
  })

  // Consuming backend route with useQuery hook of react-apollo
  const { data, loading, error } = useQuery<
    GetGitHubRepositoriesQuery,
    GetGitHubRepositoriesArgs
  >(GITHUB_REPOSITORIES_QUERY, {
    variables: {
      org: selected,
      ...filters,
    },
  })

  const orgData = data?.getGitHubRepositoriesByOrg

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const inputOrg = e.currentTarget.org.value.trim()

        if (!inputOrg) return

        setSelected(inputOrg)
        setFilters({ sort: inputSort, direction: inputDirection })
      }}
    >
      <Layout
        pageHeader={
          <PageHeader
            title={
              <div className="flex flex-column">
                <div className="mb6">
                  <ListRepositoriesSearchInput
                    selected={selected}
                    loading={loading}
                  />
                </div>

                {orgData?.org && (
                  <ListRepositoriesPageTitle
                    org={orgData.org}
                    countRepositories={orgData.repositories.length}
                  />
                )}
              </div>
            }
          />
        }
      >
        {selected && (
          <PageBlock>
            {error && <Alert type="error">{error.message}</Alert>}

            {!error && !!orgData?.repositories?.length && (
              <ListRepositoriesFilters
                filters={filters}
                loading={loading}
                inputSort={inputSort}
                inputDirection={inputDirection}
                setInputSort={setInputSort}
                setInputDirection={setDirection}
              />
            )}

            {loading && <Spinner />}

            {!loading &&
              !error &&
              !orgData?.repositories?.length &&
              formatMessage(messages.listRepositoriesEmptyLabel)}

            {!loading && !!orgData?.repositories?.length && (
              <ListRepositoriesContent repositories={orgData.repositories} />
            )}
          </PageBlock>
        )}
      </Layout>
    </form>
  )
}

// Settings for the site editor.
// The schema `properties` key correspond to the component props.
ListRepositoriesGraphQL.schema = {
  title: 'admin/editor.list-repositories.title',
  description: 'admin/editor.list-repositories.description',
  type: 'object',
  properties: {
    defaultOrg: {
      type: 'string',
      title: 'admin/editor.list-repositories.props.default-org.title',
      description:
        'admin/editor.list-repositories.props.default-org.description',
    },
  },
}

export default ListRepositoriesGraphQL
