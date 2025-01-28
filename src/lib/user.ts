import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}
export async function getUserById(id: string) {
  return await db.user.findUnique({
    where: {
      id: id,
    },
  });
}
