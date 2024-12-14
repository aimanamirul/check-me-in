import { z } from 'zod';

// Interfaces

export interface Note {
  id: number;
  title?: string;
  text: string;
  created_at?: string;
  updated_at?: string;
  synced?: boolean;
}

export interface NoteWithSync extends Note {
  synced?: boolean;
}

export interface Todo {
  id: number;
  todo_task: string;
  todo_date: Date;
  completed: boolean;
}

export interface User {
  username?: string;
  email?: string;
} 

export interface Agenda {
  id: number;
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
}

// Zod Schemas

export const userRegSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).max(20, { message: "Username must be less than 20 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).max(20, { message: "Password must be less than 20 characters" }),
});

export const noteSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1, { message: "Text is required" }),
});

