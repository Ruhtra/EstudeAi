'use server'

import { contactFormSchema } from './schema'
import { z } from 'zod'

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

export async function contactFormAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = await contactFormSchema.parseAsync(Object.fromEntries(formData))

    // This simulates a slow response like a form submission.
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add the new contact to our simulated database
    inMemoryDB.contacts.push({
      id: Date.now(), // Use timestamp as a simple unique id
      ...data,
      createdAt: new Date().toISOString()
    })

    console.log('New contact added:', data)
    console.log('Current contacts in DB:', inMemoryDB.contacts)

    return {
      defaultValues: {
        name: '',
        email: '',
        message: '',
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}

// Function to get all contacts (for demonstration purposes)
export async function getAllContacts() {
  // In a real application, you might want to add pagination or limiting here
  return inMemoryDB.contacts
}

