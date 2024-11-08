import { createSeedClient } from '@snaplet/seed';

const main = async () => {
  const seed = await createSeedClient();

  await seed.$resetDatabase();

  await seed.user((x) =>
    x(
      { min: 5, max: 10 },
      {
        posts: (x) =>
          x(
            { min: 15, max: 30 },
            {
              comments: (x) =>
                x(
                  { min: 20, max: 25 },
                  {
                    likes: (x) => x(1),
                  }
                ),
              likes: (x) => x(1),
            }
          ),
      }
    )
  );

  console.log('Database seeded successfully!');

  void process.exit();
};

main();
