import { json } from 'co-body'

type SessionValue = { value?: string | null }

type SessionTransformInput = {
  checkout?: { orderFormId?: SessionValue }
  profile?: { email?: SessionValue }
}

type SessionTransformOutput = {
  public: {
    affiliateId: SessionValue
    affiliateEmail: SessionValue
  }
}

type Affiliate = { id: string; email: string }

const AFFILIATES_ENTITY = 'vtex_affiliates_affiliates'
const AFFILIATES_APP_ID = 'affiliates'
const AFFILIATES_FIELD_NAME = 'affiliateId'

export async function setAffiliateOrderForm(ctx: Context) {
  const {
    req,
    clients: { checkout, masterdataSchemas, masterdata },
  } = ctx

  const body: SessionTransformInput = await json(req)
  const email = body.profile?.email?.value
  const orderFormId = body.checkout?.orderFormId?.value
  const response: SessionTransformOutput = {
    public: {
      affiliateId: { value: null },
      affiliateEmail: { value: null },
    },
  }

  const lastSchema = email
    ? await masterdataSchemas.getLastSchema(AFFILIATES_ENTITY)
    : null

  const [affiliate] = lastSchema
    ? await masterdata.searchDocuments<Affiliate | undefined>({
        dataEntity: AFFILIATES_ENTITY,
        fields: ['id', 'email'],
        pagination: { page: 1, pageSize: 1 },
        schema: lastSchema,
        where: `email=${email}`,
      })
    : []

  if (orderFormId) {
    const commonArgs = {
      orderFormId,
      appId: AFFILIATES_APP_ID,
      appFieldName: AFFILIATES_FIELD_NAME,
    }

    if (affiliate) {
      await checkout.setCustomData({ ...commonArgs, value: affiliate.id })

      response.public.affiliateId.value = affiliate.id
      response.public.affiliateEmail.value = email
    } else {
      await checkout.deleteCustomData(commonArgs)
    }
  }

  ctx.body = response
}
