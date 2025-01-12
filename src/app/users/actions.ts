"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { userSchema, UserFormData } from "./lib/schema";

const prisma = new PrismaClient();

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: UserFormData) {
  const validatedData = userSchema.parse(data);
  const user = await prisma.user.create({
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

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  revalidatePath("/users");
  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: {id}
  });
  
  await revalidatePath("/users"); // Espera a revalidação ser concluída
} 