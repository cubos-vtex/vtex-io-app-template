import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Alert,
  Button,
  Card,
  Dropdown,
  InputButton,
  Layout,
  Link,
  PageBlock,
  PageHeader,
  Spinner,
} from 'vtex.styleguide'

import { apiRequestFactory, withQueryClient } from './service'
import type { RepositoriesData } from './typings'
import messages from './utils/messages'

type Props = {
  defaultOrg?: string
}

function ListRepositories({ defaultOrg = '' }: Props) {
  const { formatMessage } = useIntl()

  const SORT_OPTIONS = [
    { label: formatMessage(messages.sortNameLabel), value: 'full_name' },
    { label: formatMessage(messages.sortCreatedLabel), value: 'created' },
    { label: formatMessage(messages.sortUpdatedLabel), value: 'updated' },
    { label: formatMessage(messages.sortPushedLabel), value: 'pushed' },
  ]

  const SORT_DIRECTION_OPTIONS = [
    {
      label: formatMessage(messages.directionAscLabel),
      value: 'asc',
    },
    { label: formatMessage(messages.directionDescLabel), value: 'desc' },
  ]

  const DEFAULT_SORT = SORT_OPTIONS[0].value
  const DEFAULT_DIRECTION = SORT_DIRECTION_OPTIONS[0].value

  const [selected, setSelected] = useState(defaultOrg)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [direction, setDirection] = useState(DEFAULT_DIRECTION)
  const [query, setQuery] = useState({
    sort: DEFAULT_SORT,
    direction: DEFAULT_DIRECTION,
  })

  // Consuming backend route with useQuery hook of @tanstack/react-query.
  const { data, error, isFetching } = useQuery<RepositoriesData, Error>({
    queryKey: ['repositories', selected, query],
    enabled: !!selected,
    keepPreviousData: true,
    queryFn: apiRequestFactory({
      url: `/_v/<APP_NAME>/get-repositories-by-org/${selected}`,
      query,
    }),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const inputOrg = e.currentTarget.org.value.trim()

        if (!inputOrg) return

        setSelected(inputOrg)
        setQuery({ sort, direction })
      }}
    >
      <Layout
        pageHeader={
          <PageHeader
            title={
              <div className="flex flex-column">
                <div className="mb6">
                  <InputButton
                    name="org"
                    label={formatMessage(messages.inputLabel)}
                    placeholder={formatMessage(messages.inputPlaceholder)}
                    size="regular"
                    button={formatMessage(messages.inputButtonLabel)}
                    defaultValue={selected}
                    isLoading={isFetching}
                    buttonProps={{ disabled: !selected }}
                  />
                </div>

                {data?.org && (
                  <div className="flex items-center t-heading-2">
                    {data.org.avatarUrl && (
                      <img
                        src={data.org.avatarUrl}
                        alt={data.org.name}
                        width="50"
                        className="mr4"
                      />
                    )}
                    <span>
                      {formatMessage(messages.listRepositoriesTitle, {
                        org: (
                          <Link
                            href={`https://github.com/${data.org.name}`}
                            target="_blank"
                            rel="noreferrer"
                            key={data.org.name}
                          >
                            {data.org.name}
                          </Link>
                        ),
                        count: data.repositories.length,
                      })}
                    </span>
                  </div>
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
              <div className="flex mb6 justify-center">
                <span className="mr2">
                  <Dropdown
                    name="sort"
                    disabled={isFetching}
                    placeholder={formatMessage(messages.sortPlaceholder)}
                    options={SORT_OPTIONS}
                    value={sort}
                    onChange={(_: unknown, v: string) => setSort(v)}
                  />
                </span>
                <span className="mr2">
                  <Dropdown
                    name="direction"
                    disabled={isFetching}
                    placeholder={formatMessage(messages.directionPlaceholder)}
                    options={SORT_DIRECTION_OPTIONS}
                    value={direction}
                    onChange={(_: unknown, v: string) => setDirection(v)}
                  />
                </span>
                <span>
                  <Button
                    type="submit"
                    variation="secondary"
                    disabled={
                      isFetching ||
                      (query.sort === sort && query.direction === direction)
                    }
                  >
                    {formatMessage(messages.sortDirectionButtonLabel)}
                  </Button>
                </span>
              </div>
            )}
            {isFetching && <Spinner />}
            {!isFetching &&
              !error &&
              !data?.repositories?.length &&
              formatMessage(messages.listRepositoriesEmptyLabel)}
            {!isFetching && !!data?.repositories?.length && (
              <div className="flex flex-wrap justify-center">
                {data.repositories.map((repo) => (
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    key={repo.name}
                    className="bw2 br2 b--solid b--transparent hover-b--action-primary ma2 no-underline"
                    style={{
                      width: 200,
                      wordBreak: 'break-word',
                    }}
                  >
                    <Card>
                      <div
                        className="flex flex-column justify-center tc c-action-primary hover-c-action-primary"
                        style={{ height: 140 }}
                      >
                        <span className="fw6">{repo.name}</span>
                        {!!repo.description && (
                          <div
                            className="mt4 t-small c-on-base"
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '4',
                              overflow: 'hidden',
                            }}
                          >
                            {repo.description}
                          </div>
                        )}
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
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
