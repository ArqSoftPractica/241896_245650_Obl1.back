import prisma from 'models/client';

afterEach(async () => {
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.family.deleteMany();

  await prisma.$disconnect();
});

it('create new administrator', async () => {
  expect(true).toBe(true);
});
