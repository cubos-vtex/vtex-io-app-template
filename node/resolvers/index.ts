import { getGitHubRepositoriesByOrg } from './queries/getGitHubRepositoriesByOrg'

export default {
  resolvers: {
    Query: { getGitHubRepositoriesByOrg },
  },
}
