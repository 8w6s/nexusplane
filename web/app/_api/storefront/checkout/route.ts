import { NextResponse } from 'next/server'

import { createCheckoutSession } from '@/lib/demo-store'
import type { CheckoutRequest } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CheckoutRequest> | null

    if (!payload?.planId) {
      return NextResponse.json({ error: 'planId is required' }, { status: 400 })
    }

    const session = createCheckoutSession({
      planId: payload.planId,
      billingEmail: payload.billingEmail,
      paymentMethod: payload.paymentMethod,
      couponCode: payload.couponCode,
    })

    return NextResponse.json(session)
  } catch (error) {
    if (error instanceof Error && error.message === 'selected-plan-not-found') {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Unable to create demo checkout' }, { status: 500 })
  }
}
