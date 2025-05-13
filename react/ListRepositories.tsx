import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, Layout, PageBlock, PageHeader, Spinner } from 'vtex.styleguide'

import {
  ListRepositoriesContent,
  ListRepositoriesFilters,
  ListRepositoriesPageTitle,
  ListRepositoriesSearchInput,
} from './components/list-repositories'
import { useListRepositoriesFilters } from './components/list-repositories/hooks'
import { apiRequestFactory, withQueryClient } from './service'
import type { GitHubOrganizationRepositories } from './typings'
import messages from './utils/messages'

type Props = {
  defaultOrg?: string
}

function ListRepositories({ defaultOrg = '' }: Props) {
  const { formatMessage } = useIntl()
  const { DEFAULT_SORT, DEFAULT_DIRECTION } = useListRepositoriesFilters()
  const [selected, setSelected] = useState(defaultOrg)
  const [inputSort, setInputSort] = useState(DEFAULT_SORT)
  const [inputDirection, setInputDirection] = useState(DEFAULT_DIRECTION)
  const [filters, setFilters] = useState({
    sort: DEFAULT_SORT,
    direction: DEFAULT_DIRECTION,
  })

  // Consuming backend route with useQuery hook of @tanstack/react-query.
  const { data, error, isFetching } = useQuery<
    GitHubOrganizationRepositories,
    Error
  >({
    queryKey: ['repositories', selected, filters],
    enabled: !!selected,
    keepPreviousData: true,
    queryFn: apiRequestFactory({
      url: `/_v/<APP_NAME>/get-repositories-by-org/${selected}`,
      query: filters,
    }),
  })

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
                    loading={isFetching}
                  />
                </div>

                {data?.org && (
                  <ListRepositoriesPageTitle
                    org={data.org}
                    countRepositories={data.repositories.length}
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

            {!error && !!data?.repositories?.length && (
              <ListRepositoriesFilters
                filters={filters}
                loading={isFetching}
                inputSort={inputSort}
                inputDirection={inputDirection}
                setInputSort={setInputSort}
                setInputDirection={setInputDirection}
              />
            )}

            {isFetching && <Spinner />}

            {!isFetching &&
              !error &&
              !data?.repositories?.length &&
              formatMessage(messages.listRepositoriesEmptyLabel)}

            {!isFetching && !!data?.repositories?.length && (
              <ListRepositoriesContent repositories={data.repositories} />
            )}
          </PageBlock>
        )}
      </Layout>
    </form>
  )
}

// Settings for the site editor.
// The schema `properties` key correspond to the component props.
ListRepositories.schema = {
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

export default withQueryClient(ListRepositories)
