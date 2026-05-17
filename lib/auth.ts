import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated user is missing a primary email address.");
  }

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
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
