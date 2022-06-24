const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.categoriesOnTasks.deleteMany();
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.password.deleteMany();

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  for (let index = 0; index < 10; index++) {
    await prisma.task.create({
      data: {
        title: faker.company.companyName(),
        notes: faker.lorem.paragraph(),
        userId: user.id,
        done: false,
        incomplete: false,
      },
    });
  }

  for (let index = 0; index < 5; index++) {
    await prisma.category.create({
      data: {
        title: `My ${index} category`,
        userId: user.id,
        color: faker.internet.color(),
        textColor: faker.internet.color(),
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
