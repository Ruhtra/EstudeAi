// contexts/UserContext.tsx
'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { createGenericContext } from './_components/GenericContext'
import axios from 'axios'
import { createUser as createUserAction, deleteUser as deleteUserAction, UserDTO } from '../(application)/admin/users/_actions/user'
import { formSchema } from '../(application)/admin/users/_actions/user.schema'
import { z } from 'zod'



type CreateUserDto = z.infer<typeof formSchema>
type DeleteUserDto = {
    id: string
}


// Ajuste o tipo de retorno para corresponder ao que a mutação realmente retorna
type ReturnCreateUser = Awaited<ReturnType<typeof createUserAction>>

const fetchUsers = async (): Promise<UserDTO[]> => {
    const { data } = await axios.get('/api/users')
    return data
}

const createUser = async (input: CreateUserDto): Promise<ReturnCreateUser> => {
    return await createUserAction(input)
}

const deleteUser = async ({id}: DeleteUserDto): Promise<ReturnCreateUser> => {
    return await deleteUserAction(id)
}


const {
    Provider: UserProviderRaw,
    useGenericContext: useUserContext
} = createGenericContext<
    UserDTO,
    CreateUserDto,
    ReturnCreateUser,
    undefined,
    undefined,
    DeleteUserDto,
    ReturnCreateUser
>()


const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const query = useQuery<UserDTO[]>({
        queryKey: ['users'],
        queryFn: fetchUsers
    })

    const createMutation = useMutation({
        mutationFn: createUser,
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
                deleteMutation
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