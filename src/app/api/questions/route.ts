import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export interface QuestionsDto {
  id: string;
  statement: string;
  discipline: string;
  alternatives: {
    id: string;
    content: string;
    isCorrect: boolean;
  }[];
}

export async function GET() {
  try {
    // const user = await currentUser();
    const questions = await db.question.findMany({
      include: { Alternative: true, Discipline: true },
    });
    // const usersFiltered = users.filter((u) => u.id !== user.id);

    const examsDto: QuestionsDto[] = questions.map((e) => {
      return {
        id: e.id,
        statement: e.statement,
        alternatives: e.Alternative.map((a) => {
          return {
            id: a.id,
            content: a.content,
            isCorrect: a.isCorrect,
          };
        }),
        discipline: e.Discipline.name,
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
