"use server";

import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { z } from "zod";
// import { createUserSchema } from "./user.schema";
import { getUserByEmail } from "@/lib/user";
import { formSchema } from "./user.schema";
import { revalidatePath } from "next/cache";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string;
  role: UserRole;
  image: string | null;
  // Adicione outros campos necessários aqui
}

export const getUsers = async (): Promise<UserDTO[] | undefined> => {
  const users = await db.user.findMany();

  const userDTOs: UserDTO[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    image: user.image,
    role: user.role,
    // Mapeie outros campos necessários aqui
  }));

  return userDTOs;
};

export const createUser = async (data: z.infer<typeof formSchema>) => {
  const parseUser = formSchema.safeParse(data);

  if (!parseUser.success) return { error: "Invalid data" };
  const user = parseUser.data;

  const existingUser = await getUserByEmail(user.email);
  if (existingUser) return { error: "Email already exist!" };

  const existingPhone = await db.user.findUnique({
    where: {
      phone: user.phone,
    },
  });
  if (existingPhone) return { error: "Phone already exist!" };

  if (user.role === UserRole.student) {
    await db.user.create({
      data: {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        state: user.state,
        // image: user.image,
      },
    });
  } else {
    const existingCpf = await db.user.findUnique({
      where: {
        cpf: user.cpf,
      },
    });
    if (existingCpf) return { error: "Cpf already exist!" };
    await db.user.create({
      data: {
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        // image: user.image,
      },
    });
  }

  revalidatePath("/admin/users");

  return { success: "User create!" };
};

export const deleteUser = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return { error: "User not found" };

  await db.user.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin/users");
  return { success: "User deleted" };
};
