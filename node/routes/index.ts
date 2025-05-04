import { method } from '@vtex/api'

import { getRepositoriesByOrg } from './getRepositoriesByOrg'

export default {
  getRepositoriesByOrg: method({ GET: getRepositoriesByOrg }),
}
