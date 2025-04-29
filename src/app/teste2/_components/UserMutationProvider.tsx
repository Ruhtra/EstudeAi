

// 'use client';
// import { GenericMutationContext } from "./GenericMutationContext";
// import { useMutation } from "@tanstack/react-query";

// export const UserMutationProvider = ({ children }: { children: React.ReactNode }) => {
//   const useCreateMutation = () => useMutation({
//     mutationFn: async (data: { name: string }) => await fetch('/api/users', { method: 'POST', body: JSON.stringify(data) })
//   });

//   const getDeleteMutation = (userId: string) => useMutation({
//     mutationFn: async () => await fetch(`/api/users/${userId}`, { method: 'DELETE' })
//   });

//   return (
//     <GenericMutationContext.Provider value={{ useCreateMutation, getDeleteMutation }}>
//       {children}
//     </GenericMutationContext.Provider>
//   );
// };
