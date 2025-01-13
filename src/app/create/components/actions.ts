"use server";

import { PrismaClient } from "@prisma/client";
import { contactFormSchema } from "./schema";
import { createServerAction } from "zsa";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prismaClient } from "../../../../prisma/connect";

export async function getAllContacts() {
  return await prismaClient.contactTest.findMany();
}

// Function to check if an email already exists
export async function checkEmailExists(email: string): Promise<boolean> {
  // Simulate a delay to mimic a database query
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = await prismaClient.contactTest.findFirst({
    where: {
      email: email,
    },
  });
  return !!user;
}

export const deleteContact = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const contact = await prismaClient.contactTest.findFirst({
      where: {
        email: input.email,
      },
    });

    if (!contact) throw new Error("Contact not found");
    revalidatePath("/create");

    return prismaClient.contactTest.delete({
      where: {
        id: contact.id,
      },
    });
  });
export const newContactFormAction = createServerAction()
  .input(contactFormSchema)
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add the new contact to our simulated database
    await prismaClient.contactTest.create({
      data: {
        id: randomUUID(),
        email: input.email,
        name: input.name,
        message: input.message,
      },
    });
    revalidatePath("/create");

    console.log("New contact added:", input);

    return {
      email: input.email,
    };
  });
