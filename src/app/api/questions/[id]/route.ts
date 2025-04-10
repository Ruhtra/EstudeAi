import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { QuestionsDto } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const id = await param.id;
    // const user = await currentUser();
    const question = await db.question.findUnique({
      include: { Alternative: true, Discipline: true, Text: true },
      where: {
        id: id,
      },
    });

    if (!question)
      return NextResponse.json(
        { error: "question not found" },
        { status: 404 }
      );
    // const usersFiltered = users.filter((u) => u.id !== user.id);

    const examsDto: QuestionsDto = {
      id: question.id,
      number: question.number,
      statement: question.statement,
      isAnnulled: question.isAnnulled,
      alternatives: question.Alternative.map((a) => {
        return {
          id: a.id,
          contentType: a.contentType,
          content: a.content,
          imageUrl: a.imageUrl,
          isCorrect: a.isCorrect,
        };
      }),
      texts: question.Text.map((e) => {
        return {
          id: e.id,
          number: e.number,
          contentType: e.contentType,
          content: e.content,
          imageUrl: e.imageUrl,
        };
      }),
      discipline: question.Discipline.name,
    };

    return NextResponse.json(examsDto);
  } catch (error) {
    console.error("Failed to fetch exams:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}
