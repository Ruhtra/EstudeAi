import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ContentType } from "@prisma/client";

export interface TextsDto {
  id: string;
  number: number;
  contentType: ContentType;
  content: string | null;
  imageUrl: string | null;
  reference: string | null;
  questionCount: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  try {
    let texts;

    if (examId) {
      texts = await db.text.findMany({
        include: {
          Exam: true,
          Question: true,
        },
        where: {
          examId: examId,
        },
        orderBy: {
          number: "asc",
        },
      });
    } else {
      texts = await db.text.findMany({
        include: {
          Exam: true,
          Question: true,
        },
      });
    }

    const textsDto: TextsDto[] = texts.map((e) => {
      return {
        id: e.id,
        number: e.number,
        contentType: e.contentType,
        content: e.content,
        imageUrl: e.imageUrl,
        reference: e.reference,
        questionCount: e.Question.length,
      };
    });

    return NextResponse.json(textsDto);
  } catch (error) {
    console.error("Failed to fetch texts:", error);
    return NextResponse.json(
      { error: "Failed to fetch texts" },
      { status: 500 }
    );
  }
}
