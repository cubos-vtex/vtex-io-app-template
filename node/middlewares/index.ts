import { method } from '@vtex/api'

import { setAffiliateOrderForm } from './setAffiliateOrderForm'

export default {
  setAffiliateOrderForm: method({ POST: setAffiliateOrderForm }),
}
