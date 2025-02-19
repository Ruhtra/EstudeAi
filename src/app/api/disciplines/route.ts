import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface DisciplinesDto {
  id: string;
  name: string;
}

export async function GET(request: Request) {
  try {
    const disciplines = await db.discipline.findMany({});

    const disciplinesDto: DisciplinesDto[] = disciplines.map((e) => {
      return {
        id: e.id,
        name: e.name,
      };
    });

    return NextResponse.json(disciplinesDto);
  } catch (error) {
    console.error("Failed to fetch disciplines:", error);
    return NextResponse.json(
      { error: "Failed to fetch disciplines" },
      { status: 500 }
    );
  }
}
