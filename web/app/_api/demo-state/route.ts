import { NextResponse } from 'next/server'

import { hydrateDemoSnapshot } from '@/lib/demo-state'
import { readDemoState, writeDemoState } from '@/lib/demo-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ state: readDemoState() })
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { state?: unknown } | unknown
    const state = hydrateDemoSnapshot(isStateEnvelope(payload) ? payload.state : payload)

    return NextResponse.json({ state: writeDemoState(state) })
  } catch {
    return NextResponse.json({ error: 'Invalid demo state payload' }, { status: 400 })
  }
}

function isStateEnvelope(payload: unknown): payload is { state?: unknown } {
  return Boolean(payload && typeof payload === 'object' && 'state' in payload)
}
