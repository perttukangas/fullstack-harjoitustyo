import { createSeedClient } from '@snaplet/seed';

const main = async () => {
  const seed = await createSeedClient();

  await seed.$resetDatabase();

  await seed.user((x) =>
    x(10, {
      posts: (x) =>
        x(30, {
          comments: (x) => x(30),
        }),
    })
  );

  console.log('Database seeded successfully!');

  void process.exit();
};

main();
