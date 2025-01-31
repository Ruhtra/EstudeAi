import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { UserDTO } from "@/app/(application)/admin/users/_actions/user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const id = await param.id;

    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDTO: UserDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      imageUrl: user.imageurl,
      role: user.role,
      city: user.city,
      state: user.state,
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
