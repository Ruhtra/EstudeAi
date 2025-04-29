"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGenericContext } from "./_components/GenericMutationContext";

type UserDto = {
  id: string;
  name: string;
  email: string;
};

type CreateUserDto = {
  name: string;
};
type UpdateUserDto = {
  name: string;
};

// type DeleteUserDto = {
//   userId: string;
// };

const { Provider: UserProviderRaw, useGenericContext: useUserContext } =
  createGenericContext<
    void,
    UserDto[],
    UpdateUserDto,
    void,
    CreateUserDto,
    void,
    void,
    void
  >();

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const useFetchUsers = useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Example data for UserDto
      return [
        {
          id: "1",
          name: "John Doe",
          email: "johndoe@example.com",
        },
      ];
    },
  });

  const useCreateMutation = () =>
    useMutation({
      mutationKey: ["user", "create"],
      mutationFn: async (data: CreateUserDto) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    });

  const useDeleteMutation = (id: string) =>
    useMutation({
      mutationKey: ["user", "delete", id],
      mutationFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetch(`/api/users/${id}`, { method: "DELETE" });
      },
    });

  const useUpdateMutation = (id: string) =>
    useMutation({
      mutationKey: ["user", "update", id],
      mutationFn: async (data: UpdateUserDto) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetch(`/api/users/${data.name}`, {
          method: "PUT",
          body: JSON.stringify({ name: data.name }),
        });
      },
    });

  return (
    <UserProviderRaw
      value={{
        useFetchQuery: useFetchUsers,
        useUpdateMutation: useUpdateMutation,
        useCreateMutation: useCreateMutation,
        useDeleteMutation: useDeleteMutation,
      }}
    >
      {children}
    </UserProviderRaw>
  );
};

export { UserProvider, useUserContext };
