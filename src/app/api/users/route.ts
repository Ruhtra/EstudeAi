import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { userSchema } from "../../users/lib/schema";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = userSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, birthDate, password } = validationResult.data;

    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        birthDate: new Date(birthDate),
        passwordHash: password ?? "", // Note: In a real app, you should hash this password
        isSubscribed: false,
        createdAt: new Date(),
        role: "admin",
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
