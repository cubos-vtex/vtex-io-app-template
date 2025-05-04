import { Service } from '@vtex/api'

import clients from './clients'
import routes from './routes'

export default new Service({ clients, routes })
