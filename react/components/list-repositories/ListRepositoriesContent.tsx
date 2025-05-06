import React from 'react'
import { Card } from 'vtex.styleguide'

import type { GitHubRepository } from '../../typings'

type Props = {
  repositories: GitHubRepository[]
}
export default function ListRepositoriesContent({ repositories }: Props) {
  return (
    <div className="flex flex-wrap justify-center">
      {repositories.map((repo) => (
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
  )
}
