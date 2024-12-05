import { prisma, simpleSeed } from '../src/core/lib/prisma';

export async function main() {
  await simpleSeed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
