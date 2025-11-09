import { NextResponse } from 'next/server'

import { getProviderAvailable } from '@/app/libs/providers/providers'

// GET request
export async function GET() {
  const team = await getProviderAvailable()
  return NextResponse.json(team)
}
