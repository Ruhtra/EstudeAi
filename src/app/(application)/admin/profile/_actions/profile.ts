"use server";

import { z } from "zod";
import { profileSchema } from "./profile.schema";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@/lib/auth";

export const updateMe = async (data: z.infer<typeof profileSchema>) => {
  const { id: idUser } = await currentUser();
  if (!idUser) {
    return { error: "User ID not found" };
  }

  const parseUser = profileSchema.safeParse(data);

  if (!parseUser.success) return { error: "Invalid data" };
  const user = parseUser.data;
  const [existingUser, emailConflict, phoneConflict] = await Promise.all([
    db.user.findUnique({ where: { id: idUser } }),
    db.user.findUnique({ where: { email: user.email } }),
    db.user.findUnique({ where: { phone: user.phone } }),
  ]);

  let cpfConflict;
  if (user.role !== UserRole.student)
    cpfConflict = await db.user.findUnique({ where: { cpf: user.cpf } });

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

  let changeEmail = false;
  if (user.email != existingUser.email) changeEmail = true;

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
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        emailVerified: changeEmail ? null : undefined,
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
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        emailVerified: changeEmail ? null : undefined,
      },
    });
  }
  // revalidatePath("/admin/users");

  return { success: "User updated!" };
};
