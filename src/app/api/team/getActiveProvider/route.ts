import { NextResponse } from 'next/server'

import { getProviderAvailable } from '@/app/libs/providers/providers'
import { getPrismaClient } from '@/app/libs/prisma'

// GET request
export async function GET() {
   const prisma=getPrismaClient()
  const team = await getProviderAvailable(prisma)
  return NextResponse.json(team)
}
