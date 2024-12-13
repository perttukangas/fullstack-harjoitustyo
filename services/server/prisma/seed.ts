import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { prisma, resetDatabase } from '../src/core/lib/prisma';

const userActions = async (user: User) => {
  for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        userId: user.id,
      },
    });
  }

  const allPosts = await prisma.post.findMany();

  for (let k = 0; k < faker.number.int({ min: 15, max: 30 }); k++) {
    const randomPost =
      allPosts[faker.number.int({ min: 0, max: allPosts.length - 1 })];
    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        postId: randomPost.id,
        userId: user.id,
      },
    });
  }

  for (let l = 0; l < faker.number.int({ min: 10, max: 15 }); l++) {
    const randomPost =
      allPosts[faker.number.int({ min: 0, max: allPosts.length - 1 })];
    try {
      await prisma.postLikes.create({
        data: {
          postId: randomPost.id,
          userId: user.id,
        },
      });
    } catch {
      // Fail silently if already liked
    }
  }

  const allComments = await prisma.comment.findMany();

  for (let m = 0; m < faker.number.int({ min: 15, max: 20 }); m++) {
    const randomComment =
      allComments[faker.number.int({ min: 0, max: allComments.length - 1 })];
    try {
      await prisma.commentLikes.create({
        data: {
          commentId: randomComment.id,
          userId: user.id,
        },
      });
    } catch {
      // Fail silently if already liked
    }
  }
};

export async function main() {
  await resetDatabase();

  for (let i = 1; i < 26; i++) {
    const userPassword = await bcrypt.hash(`${i}23456`, 10);
    const userEmail = i === 1 ? 'test@example.com' : `test${i}.example.com`;
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        password: userPassword,
      },
    });

    await userActions(user);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
