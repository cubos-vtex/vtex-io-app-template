import React from 'react'
import { useIntl } from 'react-intl'
import { Button, Dropdown } from 'vtex.styleguide'

import messages from '../../utils/messages'
import { useListRepositoriesFilters } from './hooks'

type Props = {
  loading: boolean
  filters: {
    sort: string
    direction: string
  }
  inputSort: string
  inputDirection: string
  setInputSort: (sort: string) => void
  setInputDirection: (direction: string) => void
}

export function ListRepositoriesFilters({
  loading,
  filters,
  inputSort,
  inputDirection,
  setInputSort,
  setInputDirection,
}: Props) {
  const { formatMessage } = useIntl()
  const { SORT_OPTIONS, SORT_DIRECTION_OPTIONS } = useListRepositoriesFilters()

  return (
    <div className="flex mb6 justify-center">
      <span className="mr2">
        <Dropdown
          name="sort"
          disabled={loading}
          placeholder={formatMessage(messages.sortPlaceholder)}
          options={SORT_OPTIONS}
          value={inputSort}
          onChange={(_: unknown, v: string) => setInputSort(v)}
        />
      </span>
      <span className="mr2">
        <Dropdown
          name="direction"
          disabled={loading}
          placeholder={formatMessage(messages.directionPlaceholder)}
          options={SORT_DIRECTION_OPTIONS}
          value={inputDirection}
          onChange={(_: unknown, v: string) => setInputDirection(v)}
        />
      </span>
      <span>
        <Button
          type="submit"
          variation="secondary"
          disabled={
            loading ||
            (filters.sort === inputSort && filters.direction === inputDirection)
          }
        >
          {formatMessage(messages.sortDirectionButtonLabel)}
        </Button>
      </span>
    </div>
  )
}
