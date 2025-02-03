"use server";

import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { z } from "zod";
// import { createUserSchema } from "./user.schema";
import { getUserByEmail } from "@/lib/user";
import { formSchema } from "./user.schema";
import { supabase } from "@/lib/supabase";
import cuid from "cuid";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string;
  role: UserRole;
  imageUrl: string | null;
  city: string | null;
  state: string | null;
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
    imageUrl: user.imageurl,
    role: user.role,
    city: user.city,
    state: user.state,

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

  const id = cuid();

  let imgUrl;
  let imageName;
  if (user.photo) {
    try {
      imageName = `${id}.${user.photo.name.split(".").pop()}`; // Tratamento do nome da imagem

      const res = await supabase.storage
        .from("profileImages")
        .upload(imageName, user.photo, {
          cacheControl: "3600",
          upsert: true,
        });

      if (res.error) throw res.error;

      imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${res.data.fullPath}`; // Usando variável de ambiente
    } catch (error) {
      console.error(error);
      return { error: "Não foi possível fazer upload de imagem" };
    }
  }

  if (user.role === UserRole.student) {
    await db.user.create({
      data: {
        id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        state: user.state,
        imageName: imageName ? imageName : null,
        imageurl: imgUrl ? imgUrl : null,
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
        id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        role: user.role,
        imageName: imageName ? imageName : null,
        imageurl: imgUrl ? imgUrl : null,
      },
    });
  }

  // revalidatePath("/admin/users");

  return { success: "User create!" };
};

export const updateuser = async (
  idUser: string,
  data: z.infer<typeof formSchema>
) => {
  const parseUser = formSchema.safeParse(data);
  console.log(parseUser);

  if (!parseUser.success) return { error: "Invalid data" };
  const user = parseUser.data;
  const [existingUser, emailConflict, phoneConflict, cpfConflict] =
    await Promise.all([
      db.user.findUnique({ where: { id: idUser } }),
      db.user.findUnique({ where: { email: user.email } }),
      db.user.findUnique({ where: { phone: user.phone } }),
      user.role !== UserRole.student
        ? db.user.findUnique({ where: { cpf: user.cpf } })
        : Promise.resolve(null),
    ]);

  if (!existingUser) return { error: "User not found!" };
  if (emailConflict && emailConflict.id !== idUser)
    return { error: "Email already exist!" };
  if (phoneConflict && phoneConflict.id !== idUser)
    return { error: "Phone already exist!" };
  if (cpfConflict && cpfConflict.id !== idUser)
    return { error: "Cpf already exist!" };

  let imgUrl: string | undefined;
  let imageName: string | undefined;

  //explciando fluxo
  // se tem imagem -> upsert na imagem
  // sem imagem    -> delete imagem existente

  if (user.photo) {
    try {
      imageName = `${existingUser.id}.${user.photo.name.split(".").pop()}`; // Tratamento do nome da imagem
      console.log(imageName);
      const res = await supabase.storage
        .from("profileImages")
        .upload(imageName, user.photo, {
          cacheControl: "3600",
          upsert: true,
        });

      console.log(res);

      if (res.error) throw res.error;

      imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${res.data.fullPath}`; // Usando variável de ambiente
    } catch (error) {
      console.error(error);
      return { error: "Não foi possível fazer upload de imagem" };
    }
  } else {
    // Verificar se existe imagem no bucket e deletar

    if (existingUser.imageName) {
      const existingImage = `profileImages/${existingUser.imageName}`;
      try {
        await supabase.storage.from("profileImages").remove([existingImage]);
      } catch (error) {
        console.error("Erro ao deletar imagem existente:", error);
        return { error: "Erro ao deletar imagem existente" };
      }
    }
  }

  console.log(imgUrl);

  if (user.role === UserRole.student) {
    await db.user.update({
      where: { id: idUser },
      data: {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        state: user.state,
        imageName: imageName ? imageName : null,
        imageurl: imgUrl ? imgUrl : null,
      },
    });
  } else {
    // const cpfConflict = await db.user.findUnique({
    //   where: { cpf: user.cpf },
    // });
    // if (cpfConflict && cpfConflict.id !== idUser)
    //   return { error: "Cpf already exist!" };

    await db.user.update({
      where: { id: idUser },
      data: {
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        role: user.role,
        imageName: imageName ? imageName : null,
        imageurl: imgUrl ? imgUrl : null,
      },
    });
  }
  // revalidatePath("/admin/users");

  return { success: "User updated!" };
};

export const deleteUser = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return { error: "User not found" };

  if (user.imageName) {
    try {
      const existingImage = `profileImages/${user.imageName}`;
      await supabase.storage.from("profileImages").remove([existingImage]);
    } catch (error) {
      console.error("Erro ao deletar imagem existente:", error);
      return { error: "Erro ao deletar imagem existente" };
    }
  }

  await db.user.delete({
    where: {
      id: userId,
    },
  });

  // revalidatePath("/admin/users");
  return { success: "User deleted" };
};
