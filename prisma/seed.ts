// const prisma = new PrismaClient()

async function seed() {
  console.log(`Database has been seeded. 🌱`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
