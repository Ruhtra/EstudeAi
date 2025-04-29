// 'use client'


// import { useGenericMutationContext } from "./GenericMutationContext";

// export const GenericRow = ({ item }: { item: { id: string; name: string } }) => {
//   const { getDeleteMutation } = useGenericMutationContext<any, { id: string }>();
//   const { mutate, isPending } = getDeleteMutation({ id: item.id });

//   return (
//     <div>
//       <span>{item.name}</span>
//       <button onClick={() => mutate()} disabled={isPending}>
//         {isPending ? "Deletando..." : "Deletar"}
//       </button>
//     </div>
//   );
// };
