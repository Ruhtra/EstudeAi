"use server";

import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: UserRole;
  image: string | null;
  // Adicione outros campos necessários aqui
}

const getUsers = async (): Promise<UserDTO[] | undefined> => {
  try {
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

    console.log(userDTOs);

    return userDTOs;
  } catch (error) {
    console.log(error);
  }
};

export default getUsers;
