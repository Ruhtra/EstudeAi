"use server";

import { revalidatePath } from "next/cache";
import { userSchema, UserFormData } from "./lib/schema";
import { prismaClient } from "../../../prisma/connect";

// const prisma = new PrismaClient();

export async function getUsers() {
  const exams = prismaClient.exam.findMany({
    include: {
      Question: true,
    },
  });

  console.log(exams);

  return await prismaClient.user.findMany();
}

export async function getUser(id: string) {
  return await prismaClient.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: UserFormData) {
  const validatedData = userSchema.parse(data);
  const user = await prismaClient.user.create({
    data: {
      email: validatedData.email,
      name: validatedData.name,
      id: crypto.randomUUID(),
      birthDate: new Date(validatedData.birthDate),
      passwordHash: validatedData.password ?? "", // Note: In a real app, you should hash this password
      isSubscribed: false,
      createdAt: new Date(),
      role: "admin",
    },
  });
  await revalidatePath("/users");
  return user;
}

export async function updateUser(id: string, data: UserFormData) {
  const validatedData = userSchema.parse(data);
  const updateData: any = {
    name: validatedData.name,
    email: validatedData.email,
    birthDate: new Date(validatedData.birthDate),
  };

  if (validatedData.password) {
    updateData.passwordHash = validatedData.password; // Note: In a real app, you should hash this password
  }

  const user = await prismaClient.user.update({
    where: { id },
    data: updateData,
  });
  revalidatePath("/users");
  return user;
}

export async function deleteUser(id: string) {
  await prismaClient.user.delete({
    where: { id },
  });

  await revalidatePath("/users"); // Espera a revalidação ser concluída
}
