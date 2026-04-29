import bcrypt from "bcryptjs";
import prisma from "../src/prisma.js";

async function main() {
  const hashed = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@ghc.local" },
    update: {},
    create: {
      email: "demo@ghc.local",
      name: "Demo User",
      password: hashed
    }
  });

  const repo = await prisma.repo.upsert({
    where: { owner_name: { owner: "demo", name: "alpha" } },
    update: {},
    create: {
      owner: "demo",
      name: "alpha",
      ownerId: user.id
    }
  });

  await prisma.commit.createMany({
    data: [
      {
        sha: "a1b2c3d4",
        message: "Initial layout and shell",
        author: "Demo User",
        repoId: repo.id
      },
      {
        sha: "e5f6g7h8",
        message: "Add issues and pulls",
        author: "Demo User",
        repoId: repo.id
      }
    ],
    skipDuplicates: true
  });

  await prisma.issue.createMany({
    data: [
      {
        title: "Landing page polish",
        body: "Refine hero layout and add motion.",
        repoId: repo.id,
        authorId: user.id
      },
      {
        title: "API response shape",
        body: "Make sure list endpoints are consistent.",
        repoId: repo.id,
        authorId: user.id
      }
    ]
  });

  await prisma.pullRequest.createMany({
    data: [
      {
        title: "Feature: Activity feed",
        body: "Add timeline and card layout.",
        repoId: repo.id,
        authorId: user.id
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
