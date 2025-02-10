"use server"

import { db } from "@/lib/db";

export const deleteExam = async (examId: string) => {
    const exam = await db.exam.findUnique({
      where: {
        id: examId,
      },
    });
  
    if (!exam) return { error: "Exam not found" };
  
    // if (user.imageName) {
    //   try {
    //     const existingImage = `profileImages/${user.imageName}`;
    //     await supabase.storage.from("profileImages").remove([existingImage]);
    //   } catch (error) {
    //     console.error("Erro ao deletar imagem existente:", error);
    //     return { error: "Erro ao deletar imagem existente" };
    //   }
    // }
  
    await db.exam.delete({
      where: {
        id: examId,
      },
    });
  
    // revalidatePath("/admin/users");
    return { success: "Exam deleted" };
  };
  