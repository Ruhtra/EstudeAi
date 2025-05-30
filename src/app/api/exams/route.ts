import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface ExamsDto {
  id: string;
  name: string;
  year: number;
  // position: string;
  level: string;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  bankName: string;
  instituteName: string;

  totalTexts: number;
  totalQuestions: number;
}

export async function GET() {
  try {
    // const user = await currentUser();
    const exams = await db.exam.findMany({
      include: {
        _count: {
          select: {
            Question: true,
            Text: true,
          },
        },
      },
    });
    // const usersFiltered = users.filter((u) => u.id !== user.id);

    const examsDto: ExamsDto[] = exams.map((e) => {
      return {
        id: e.id,
        name: e.name,
        year: e.year,
        // position: e.position,
        level: e.level,
        isComplete: e.isComplete,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        bankName: e.bank,
        instituteName: e.institute,

        totalQuestions: e._count.Question,
        totalTexts: e._count.Text,
      };
    });

    return NextResponse.json(examsDto);
  } catch (error) {
    console.error("Failed to fetch exams:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}
