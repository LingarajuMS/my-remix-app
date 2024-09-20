import { PrismaClient } from '@prisma/client';

// Create a new Prisma Client instance
const prisma = new PrismaClient();

// Export the Prisma client to be used in the application
export { prisma };

// Example utility function to get the Prisma client instance
export const getPrismaClient = () => {
  return prisma;
};

// Close the Prisma client connection when the app shuts down
if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', () => {
    prisma.$disconnect();
  });
  process.on('SIGINT', () => {
    prisma.$disconnect();
  });
}