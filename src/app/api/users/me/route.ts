import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export interface UserMeDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isEmailVerified: boolean;
}

export async function GET() {
  try {
    const { id } = await currentUser();
    if (!id) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDTO: UserMeDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      imageUrl: user.imageurl,
      role: user.role,
      city: user.city,
      state: user.state,
      isEmailVerified: !!user.emailVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };

    return NextResponse.json(userDTO);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
