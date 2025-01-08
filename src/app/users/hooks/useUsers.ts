"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, getUser } from "../actions";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { UserFormData } from "../lib/schema";

// const API_URL = "/api/users";

// async function fetchUsers() {
//   const response = await fetch(API_URL);
//   if (!response.ok) {
//     throw new Error("Failed to fetch users");
//   }
//   return response.json();
// }

// async function fetchUser(id: string) {
//   const response = await fetch(`${API_URL}/${id}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch user");
//   }
//   return response.json();
// }

// async function createUser(userData: UserFormData) {
//   const response = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to create user");
//   }
//   return response.json();
// }

// async function updateUser(userData: UserFormData) {
//   const response = await fetch(`${API_URL}/${userData.id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to update user");
//   }
//   return response.json();
// }

// export function useUsers() {
//   return useQuery({
//     queryKey: ["users"],
//     queryFn: fetchUsers,
//   });
// }

// export function useUser(id: string) {
//   return useQuery({
//     queryKey: ["user", id],
//     queryFn: () => fetchUser(id),
//     enabled: !!id,
//   });
// }

// export function useCreateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// }

// export function useUpdateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: updateUser,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//       queryClient.invalidateQueries({ queryKey: ["user", data.id] });
//     },
//   });
// }
