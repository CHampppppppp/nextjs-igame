import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production (serverless), use the adapter
  const connectionString = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({ adapter });
} else {
  // In development, use the default client
  prisma = globalThis.prisma || new PrismaClient({
    log: ['query'],
  });

  if (!globalThis.prisma) {
    globalThis.prisma = prisma;
  }
}

export { prisma };


