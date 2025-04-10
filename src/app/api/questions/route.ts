import { db } from "@/lib/db";
import { ContentType } from "@prisma/client";
import { NextResponse } from "next/server";

export interface QuestionsDto {
  id: string;
  number: number;
  statement: string;
  discipline: string;
  alternatives: {
    id: string;
    contentType: ContentType;
    content: string | null;
    imageUrl: string | null;
    isCorrect: boolean;
  }[];
  texts: {
    id: string;
    number: number;
    contentType: ContentType;
    content: string | null;
    imageUrl: string | null;
  }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  try {
    let questions;

    if (examId) {
      questions = await db.question.findMany({
        include: { Alternative: true, Discipline: true, Text: true },
        where: {
          examId: examId,
        },
        orderBy: {
          number: "asc",
        },
      });
    } else {
      questions = await db.question.findMany({
        include: { Alternative: true, Discipline: true, Text: true },
      });
    }

    // const user = await currentUser();

    // const usersFiltered = users.filter((u) => u.id !== user.id);

    const examsDto: QuestionsDto[] = questions.map((e) => {
      return {
        id: e.id,
        number: e.number,
        statement: e.statement,
        alternatives: e.Alternative.map((a) => {
          return {
            id: a.id,
            contentType: a.contentType,
            content: a.content,
            imageUrl: a.imageUrl,
            isCorrect: a.isCorrect,
          };
        }),
        texts: e.Text.map((e) => {
          return {
            id: e.id,
            number: e.number,
            contentType: e.contentType,
            content: e.content,
            imageUrl: e.imageUrl,
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
