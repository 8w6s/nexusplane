import { NextResponse } from 'next/server'

import { listStorefrontPlans } from '@/lib/demo-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ plans: listStorefrontPlans() })
}
