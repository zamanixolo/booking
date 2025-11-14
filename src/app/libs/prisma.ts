import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1' // <-- FIX #1: Renamed from D1Adapter
import { getCloudflareContext } from '@opennextjs/cloudflare'

export function getPrismaClient() {
  const { env } = getCloudflareContext();
  
  // This is where the 'CloudflareEnv' error is, which we fix in Step 2
  const adapter = new PrismaD1(env.DB); // <-- FIX #2: Renamed from D1Adapter
  
  return new PrismaClient({ adapter });
}
// NOTE: We do not export a single 'prisma' const.
// We export the function that *creates* the client.