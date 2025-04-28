import { Service } from '@vtex/api'

import clients from './clients'
import routes from './middlewares'

export default new Service({ clients, routes })
