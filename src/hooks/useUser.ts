import { useQuery } from "@tanstack/react-query";
import type { UserDTO } from "@/app/admin/users/_actions/user";

async function fetchUser(id: string): Promise<UserDTO> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => (id ? fetchUser(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}
