import { useQueries } from "@tanstack/react-query"
import { toast } from "sonner"
import { ExamsDto } from "@/app/api/exams/route"

// interface Option {
//   id: string
//   name: string
// }


const fetchUsers = async (): Promise<ExamsDto[]> => {
  const response = await fetch(`/api/exams`)
  if (!response.ok) {
    throw new Error(`Failed to fetch users`)
  }
  return response.json()
}

export const useExamOptions = () => {
  const results = useQueries({
    queries: [
      { queryKey: ["exams"], queryFn: fetchUsers },
    ],
  })

  const isError = results.some((result) => result.isError)
  const isLoading = results.some((result) => result.isLoading)

  if (isError && !isLoading) {
    toast("Não foi possível carregar os dados para a criação do dialog")

  }
  const banks = Array.from(new Set(results[0].data?.map((exam: ExamsDto) => exam.bankName)))
  const positions = Array.from(new Set(results[0].data?.map((exam: ExamsDto) => exam.position) ))
  const levels = Array.from(new Set(results[0].data?.map((exam: ExamsDto) => exam.level) ))
  const institutes = Array.from(new Set(results[0].data?.map((exam: ExamsDto) => exam.instituteName)))
  
  

  return {
    institutes,
    levels,
    positions,
    banks,

    isLoading,
    isError,
  }
}



// import { useQueries } from "@tanstack/react-query"
// import { toast } from "sonner"

// interface Option {
//   id: string
//   name: string
// }

// const fetchOptions = async (endpoint: string): Promise<Option[]> => {
//   const response = await fetch(`/api/${endpoint}`)
//   if (!response.ok) {
//     throw new Error(`Failed to fetch ${endpoint}`)
//   }
//   return response.json()
// }

// export const useExamOptions = () => {
//   const results = useQueries({
//     queries: [
//       { queryKey: ["institutes"], queryFn: () => fetchOptions("institutes") },
//       { queryKey: ["examBoards"], queryFn: () => fetchOptions("exam-boards") },
//       { queryKey: ["levels"], queryFn: () => fetchOptions("levels") },
//       { queryKey: ["positions"], queryFn: () => fetchOptions("positions") },
//     ],
//   })

//   const isError = results.some((result) => result.isError)
//   const isLoading = results.some((result) => result.isLoading)

//   if (isError && !isLoading) {
//     toast("Não foi possível carregar os dados para a criação do dialog")
//   }

//   return {
//     institutes: results[0].data ?? [],
//     examBoards: results[1].data ?? [],
//     levels: results[2].data ?? [],
//     positions: results[3].data ?? [],
//     isLoading,
//     isError,
//   }
// }

