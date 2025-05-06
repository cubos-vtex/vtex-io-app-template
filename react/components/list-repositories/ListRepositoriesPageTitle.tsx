import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'vtex.styleguide'

import type { GitHubOrganization } from '../../typings'
import messages from '../../utils/messages'

type Props = {
  org: GitHubOrganization
  countRepositories: number
}

export default function ListRepositoriesPageTitle({
  org,
  countRepositories,
}: Props) {
  const { formatMessage } = useIntl()

  return (
    <div className="flex items-center t-heading-2">
      {org.avatarUrl && (
        <img src={org.avatarUrl} alt={org.name} width="50" className="mr4" />
      )}
      <span>
        {formatMessage(messages.listRepositoriesTitle, {
          org: (
            <Link
              href={`https://github.com/${org.name}`}
              target="_blank"
              key={org.name}
            >
              {org.name}
            </Link>
          ),
          count: countRepositories,
        })}
      </span>
    </div>
  )
}
