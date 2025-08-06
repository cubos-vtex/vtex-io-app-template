import React from 'react'
import { useIntl } from 'react-intl'
import { InputButton } from 'vtex.styleguide'

import messages from '../../utils/messages'

type Props = Readonly<{
  selected: string
  loading: boolean
}>

export function ListRepositoriesSearchInput({ selected, loading }: Props) {
  const { formatMessage } = useIntl()

  return (
    <InputButton
      name="org"
      label={formatMessage(messages.inputLabel)}
      placeholder={formatMessage(messages.inputPlaceholder)}
      size="regular"
      button={formatMessage(messages.searchLabel)}
      defaultValue={selected}
      isLoading={loading}
      buttonProps={{ disabled: !selected }}
    />
  )
}
