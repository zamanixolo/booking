// src/lib/prisma.ts
import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';

let prisma: PrismaClient;

function createPrismaClient(): PrismaClient {
  const cfContext = getCloudflareContext();

  if (!cfContext?.env?.DB) {
    throw new Error(
      'Cloudflare D1 database binding not found. Make sure "DB" is set in wrangler.jsonc and running in a Worker environment.'
    );
  }

  const adapter = new PrismaD1(cfContext.env.DB as D1Database);
  return new PrismaClient({ adapter });
}

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
}
