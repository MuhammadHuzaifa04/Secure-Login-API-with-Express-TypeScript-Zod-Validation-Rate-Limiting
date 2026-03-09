import { z } from 'zod';

// ================= REGISTER =================

export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').trim(),

  email: z.email('Invalid email format').toLowerCase().trim(),

  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});

// ================= LOGIN =================

export const loginSchema = z.object({
  email: z.email('Invalid email format').toLowerCase().trim(),

  password: z.string().min(1, 'Password is required').trim(),
});
