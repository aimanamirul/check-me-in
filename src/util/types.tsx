import { z } from 'zod';

// Interfaces

export interface Note {
  id: number;
  title?: string;
  text: string;
  date?: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Zod Schemas

export const userRegSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).max(20, { message: "Username must be less than 20 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).max(20, { message: "Password must be less than 20 characters" }),
});
