import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TextsDto } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const id = await param.id;

    const text = await db.text.findUnique({
      where: { id: id },
      include: {
        Question: true,
      },
    });

    if (!text) {
      return NextResponse.json({ error: "text not found" }, { status: 404 });
    }

    const textDto: TextsDto = {
      id: text.id,
      number: text.number,
      contentType: text.contentType,
      content: text.content,
      imageUrl: text.imageUrl,
      reference: text.reference,
      questionCount: text.Question.length,
    };

    return NextResponse.json(textDto);
  } catch (error) {
    console.error("Failed to fetch text:", error);
    return NextResponse.json(
      { error: "Failed to fetch text" },
      { status: 500 }
    );
  }
}
