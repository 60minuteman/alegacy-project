import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ModelName = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$extends'
>;

async function clearDatabase() {
  const modelNames: ModelName[] = [
    'user',
    'pendingRegistration',
    'investment',
    // Add all your model names here
  ];

  console.log('Starting database cleanup...');

  for (const modelName of modelNames) {
    try {
      // @ts-ignore: TypeScript doesn't know about deleteMany for all models
      const result = await prisma[modelName].deleteMany();
      console.log(`Deleted ${result.count} records from ${modelName}`);
    } catch (error) {
      console.error(`Error deleting records from ${modelName}:`, error);
    }
  }

  console.log('Database cleanup completed.');
}

clearDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
