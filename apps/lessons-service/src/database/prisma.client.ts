import { PrismaClient } from '@prisma/lessons-service-client';

export const prisma = new PrismaClient({});

export type Prisma = typeof prisma;
