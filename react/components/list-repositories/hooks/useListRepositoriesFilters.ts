import { useIntl } from 'react-intl'

import messages from '../../../utils/messages'

export function useListRepositoriesFilters() {
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

  return {
    SORT_OPTIONS,
    SORT_DIRECTION_OPTIONS,
    DEFAULT_SORT,
    DEFAULT_DIRECTION,
  }
}
