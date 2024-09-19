const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Attempt to query the database
    const usersCount = await prisma.user.count()
    console.log('Connected to the database successfully!')
    console.log('Number of users in the database:', usersCount)

    // Let's try to fetch a user to see more details
    const firstUser = await prisma.user.findFirst()
    console.log('First user in the database:', firstUser)
  } catch (error) {
    console.error('Failed to connect to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
