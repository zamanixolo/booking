
import { PrismaClient } from '@prisma/client'

// Prevent multiple instances in dev
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Type-safe global declaration
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

// Use global in dev, otherwise create new
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma