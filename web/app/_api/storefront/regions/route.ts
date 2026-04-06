import { NextResponse } from 'next/server'

import { listStorefrontRegions } from '@/lib/demo-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ regions: listStorefrontRegions() })
}
