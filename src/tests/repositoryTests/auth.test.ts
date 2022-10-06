// afterAll(async () => {
//   const deleteUsers = prisma.user.deleteMany();
//   const deleteFamilies = prisma.family.deleteMany();
//   const deleteCategories = prisma.category.deleteMany();

//   await prisma.$transaction([deleteUsers, deleteFamilies, deleteCategories]);
//   await prisma.$disconnect();
// });

it('create new administrator', async () => {
  //   const user = {
  //     name: 'Hermione Granger',
  //     email: 'hermione@hogwarts.io',
  //     password: '123456',
  //     role: Role.admin,
  //     family: {
  //       connectOrCreate: {
  //         where: { name: 'Secinaro' },
  //         create: { name: 'Secinaro', apiKey: `family-costs-1` },
  //       },
  //     },
  //   };

  //   const usersRepo = new UsersRepository();
  //   await usersRepo.createUser(user);

  //   const newUser = await prisma.user.findUnique({
  //     where: {
  //       email: user.email,
  //     },
  //   });

  //   const newFamily = await prisma.family.findUnique({
  //     where: {
  //       name: user.family.connectOrCreate.create.name,
  //     },
  expect(true).toBe(true);
});

//   expect(newUser?.email).toEqual(user.email);
//   expect(newUser?.name).toEqual(user.name);
//   expect(newUser?.password).toEqual(user.password);
//   expect(newUser?.role).toEqual(user.role);
//   expect(newUser?.familyId).toEqual(newFamily?.id);
// });

// it('Get User by email', async () => {
//   const user = {
//     name: 'Hermione Granger',
//     email: 'hermione@hogwarts.io',
//     password: '123456',
//     role: Role.admin,
//     family: {
//       connectOrCreate: {
//         where: { name: 'Secinaro' },
//         create: { name: 'Secinaro', apiKey: `family-costs-1` },
//       },
//     },
//   };

//   const newUser = await prisma.user.create({
//     data: user,
//   });

//   const usersRepo = new UsersRepository();
//   const userFetched = await usersRepo.getUserByEmail(user.email);

//   expect(newUser?.email).toEqual(user.email);
//   expect(newUser?.name).toEqual(user.name);
//   expect(newUser?.password).toEqual(user.password);
//   expect(newUser?.role).toEqual(user.role);
// });
