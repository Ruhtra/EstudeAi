'use server'

import { contactFormSchema } from './schema'
import { createServerAction } from "zsa"

// Simulated in-memory database
let inMemoryDB: { contacts: any[] } = {
  contacts: []
}

// Function to check if an email already exists
export async function checkEmailExists(email: string): Promise<boolean> {
  // Simulate a delay to mimic a database query
  await new Promise(resolve => setTimeout(resolve, 100))
  return inMemoryDB.contacts.some(contact => contact.email === email)
}

export const newContactFormAction = createServerAction()
  .input(contactFormSchema,)
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add the new contact to our simulated database
    inMemoryDB.contacts.push({
      id: Date.now(), // Use timestamp as a simple unique id
      ...input,
      createdAt: new Date().toISOString()
    })

    console.log('New contact added:', input)
    console.log('Current contacts in DB:', inMemoryDB.contacts)



    return {
      email: input.email
    }
  })