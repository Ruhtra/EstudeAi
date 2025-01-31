import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserDTO } from "@/app/(application)/admin/users/_actions/user";
import { currentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await currentUser();

    const users = await db.user.findMany();
    const usersFiltered = users.filter((u) => u.id !== user.id);

    const userDTOs: UserDTO[] = usersFiltered.map((user) => ({
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

    return NextResponse.json(userDTOs);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
