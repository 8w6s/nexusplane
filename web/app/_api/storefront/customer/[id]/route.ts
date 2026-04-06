import { NextResponse, type NextRequest } from 'next/server'

import { getCustomerPortalSnapshot } from '@/lib/demo-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return NextResponse.json(getCustomerPortalSnapshot(id))
}

