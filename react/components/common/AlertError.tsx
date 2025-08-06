import React from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'vtex.styleguide'

type Props = Readonly<{ error: Error }>

export function AlertError({ error: { message } }: Props) {
  const { formatMessage } = useIntl()

  return (
    <Alert type="error">
      {formatMessage({ id: message, defaultMessage: message })}
    </Alert>
  )
}
