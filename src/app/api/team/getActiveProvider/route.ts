// app/api/providers/route.ts

// ✅ Force the Edge runtime (required for D1)
export const runtime = 'nodejs';

import { NextResponse } from 'next/server'

import { getProviderAvailable } from '@/app/libs/providers/providers'


// GET request (Read available providers)
export async function GET() {
  try {
    // The library function is now D1/Edge compatible
    const team = await getProviderAvailable()
  
    if(!team || team.length === 0){
      return NextResponse.json({msg:'no member found', team: []})
    }
  
    return NextResponse.json({team},{status:200})
  } catch (error) {
    console.error("Error fetching available providers:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}
