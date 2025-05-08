"use client";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import {
  createGenericContext,
  createGenericItemContext,
} from "./_components/GenericMutationContext";

export type UserDto = {
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

const db = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@example.com",
  },
  {
    id: "2",
    name: "John Doe",
    email: "johndoe@example.com",
  },
];

const { Provider: UserProviderRaw, useGenericContext: useUserContext } =
  createGenericContext();

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const useFetchUsers = useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Example data for UserDto
      return db;
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
        db.filter((user) => user.id !== id);
        // await fetch(`/api/users/${id}`, { method: "DELETE" });
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

  const useDeleteMultipleMutation = (id: string[]) =>
    useMutation({
      mutationKey: ["user", "delete", "multiple"],
      mutationFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // db.filter((user) => user.id !== id);
        // await fetch(`/api/users/${id}`, { method: "DELETE" });
      },
    });

  return (
    <UserProviderRaw
      value={{
        useFetchQuery: useFetchUsers,
        useUpdateMutation: useUpdateMutation,
        useCreateMutation: useCreateMutation,
        useDeleteMutation: useDeleteMutation,
        // useDeleteMultipleMutation: useDeleteMultipleMutation:
      }}
    >
      {children}
    </UserProviderRaw>
  );
};

const {
  Provider: UserItemProviderRaw,
  useGenericItemContext: useUserItemContext,
} = createGenericItemContext<void, void>();

const UserItemProvider = ({
  id,
  useDeleteMutation,
  children,
}: {
  id: string;
  useDeleteMutation: (
    id: string
  ) => UseMutationResult<void, Error, void, unknown>;
  children: React.ReactNode;
}) => {
  return (
    <UserItemProviderRaw
      value={{
        id: id,
        deleteMutate: useDeleteMutation(id),
      }}
    >
      {children}
    </UserItemProviderRaw>
  );
};

export { UserProvider, useUserContext, UserItemProvider, useUserItemContext };
