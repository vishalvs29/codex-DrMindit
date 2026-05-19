import { auth, clerkClient } from "@clerk/nextjs/server";
import { unauthorized, forbidden } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated user is missing a primary email address.");
  }

  return prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl
    },
    update: {
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl
    }
  });
}

export async function requireUser() {
  const user = await getOrCreateUser();

  if (!user) {
    throw unauthorized();
  }

  return user;
}

export async function requirePremiumUser() {
  const user = await requireUser();

  if (!user.plan || user.plan === "FREE") {
    throw forbidden("Upgrade required to access this content.");
  }

  return user;
}
