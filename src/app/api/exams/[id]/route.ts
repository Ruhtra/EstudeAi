import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ExamsDto } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const id = await param.id;

    const exam = await db.exam.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            Question: true,
            Text: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const userDTO: ExamsDto = {
      id: exam.id,
      name: exam.name,
      bankName: exam.bank,
      createdAt: exam.createdAt,
      instituteName: exam.institute,
      isComplete: exam.isComplete,
      level: exam.level,
      // position: exam.position,
      updatedAt: exam.updatedAt,
      year: exam.year,

      totalQuestions: exam._count.Question,
      totalTexts: exam._count.Text,
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
