import { z } from 'zod'
import { checkEmailExists } from './actions'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(32, { message: 'Name must be at most 32 characters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .refine(async (email) => !(await checkEmailExists(email)), {
      message: 'This email is already registered'
    }),
  message: z
    .string()
    .min(2, { message: 'Message must be at least 2 characters' })
    .max(1000, { message: 'Message must be at most 1000 characters' }),
})

