// contexts/UserContext.tsx
'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { createGenericContext } from './_components/GenericContext'
import axios from 'axios'

type User = {
  id: string
  name: string
  email: string
}

type CreateUserDto = {
  name: string
  email: string
}

type UpdateUserDto = {
  id: string
  name?: string
  email?: string
}

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get('/api/users')
  return data
}

const createUser = async (input: CreateUserDto): Promise<User> => {
  const { data } = await axios.post('/api/users', input)
  return data
}

const updateUser = async (input: UpdateUserDto): Promise<User> => {
  const { data } = await axios.put(`/api/users/${input.id}`, input)
  return data
}

const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`/api/users/${id}`)
}

const {
  Provider: UserProviderRaw,
  useGenericContext: useUserContext
} = createGenericContext<User, CreateUserDto, UpdateUserDto>()

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const query = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => query.refetch()
  })

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => query.refetch()
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => query.refetch()
  })

  return (
    <UserProviderRaw
      value={{
        query,
        createMutation,
        updateMutation,
        deleteMutation
      }}
    >
      {children}
    </UserProviderRaw>
  )
}

export {
  UserProvider,
  useUserContext
}
