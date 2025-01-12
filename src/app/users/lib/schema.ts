import { z } from "zod";
import { checkEmailExists } from "../actions";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine(async (email) => !(await checkEmailExists(email)), {
    message: "Este email já está em uso",
  }),
  birthDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
  }, "Invalid birth date"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
