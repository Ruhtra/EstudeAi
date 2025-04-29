

'use client';
import { createGenericContext } from "./Content/GenericMutationContext";
import { useMutation, useQuery } from "@tanstack/react-query";


type UserDto = {
  id: string
  name: string;
};

type CreateUserDto = {
  name: string;
};
type UpdateUserDto = {
  name: string;
};

type DeleteUserDto = {
  userId: string;
};

const {
  Provider: UserProviderRaw,
  useGenericContext: useUserContext
} = createGenericContext<
  void,
  UserDto[],
  UpdateUserDto,
  void,
  CreateUserDto,
  void,
  DeleteUserDto,
  void
>()


const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const useFetchUsers = useQuery<UserDto[]>({
    queryKey: ['users'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/api/users', { method: 'GET' });
      return response.json();
    }
  })

  const useCreateMutation = () => useMutation({
    mutationKey: ['createUser'],
    mutationFn: async (data: CreateUserDto) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetch('/api/users', { method: 'POST', body: JSON.stringify(data) })
    }
  });

  const getDeleteMutation = () => useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: async ({ userId : b }: DeleteUserDto) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    }
  });

  const useUpdateMutation = () => useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetch(`/api/users/${data.name}`, {
        method: 'PUT',
        body: JSON.stringify({ name: data.name })
      });
    }
  });

  return (
    <UserProviderRaw
      value={{
        useFetchQuery: useFetchUsers,
        useUpdateMutation: useUpdateMutation,
        useCreateMutation: useCreateMutation,
        useDeleteMutation: getDeleteMutation,
      }}
    >
      {children}
    </UserProviderRaw>
  )
}

export {
  UserProvider,
  useUserContext,
}