// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Type alias for a Prisma Client instance compatible with the D1 adapter.
 * This omits methods not available when using an adapter like D1.
 */
export type D1PrismaClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Function to get a new Prisma client instance using the D1 adapter and runtime context.
 * This must be called within a Cloudflare Worker/OpenNext context where 'env.DB' is available.
 */
export function getPrismaClient(): D1PrismaClient {
  // getCloudflareContext() retrieves the current request's Cloudflare context (env, etc.)
  const { env } = getCloudflareContext();
  
  // env.DB must be bound in your wrangler.toml file
  const adapter = new PrismaD1(env.DB);
  
  return new PrismaClient({ adapter }) as D1PrismaClient;
}
