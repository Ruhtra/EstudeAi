import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    console.log("eeeeeeeeeeentrie");
    console.log(email);

    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    console.log("paaasssei");

    console.log(user);

    return user;
  } catch (error) {
    console.log("---------------");

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
