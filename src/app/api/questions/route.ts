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

const data = [
  {
    id: "1",
    statement: "What is the capital of France?",
    discipline: "Geography",
    alternatives: [
      { id: "a", content: "London", isCorrect: false },
      { id: "b", content: "Paris", isCorrect: true },
      { id: "c", content: "Berlin", isCorrect: false },
      { id: "d", content: "Madrid", isCorrect: false },
    ],
  },
  {
    id: "2",
    statement: "Who painted the Mona Lisa?",
    discipline: "Art History",
    alternatives: [
      { id: "a", content: "Vincent van Gogh", isCorrect: false },
      { id: "b", content: "Leonardo da Vinci", isCorrect: true },
      { id: "c", content: "Pablo Picasso", isCorrect: false },
      { id: "d", content: "Michelangelo", isCorrect: false },
    ],
  },
];

export async function GET() {
  try {
    // const user = await currentUser();
    // const exams = await db.exam.findMany({
    // include: {
    //     Bank: true,
    //     Institute: true,
    //     // Question: true
    // }
    // });
    // const usersFiltered = users.filter((u) => u.id !== user.id);

    const examsDto: QuestionsDto[] = data.map((e) => {
      return {
        id: e.id,
        alternatives: e.alternatives,
        discipline: e.discipline,
        statement: e.statement,
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
