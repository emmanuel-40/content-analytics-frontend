import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(100, 'Use at most 100 characters')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/\d/, 'Include a number')
  .regex(/[@$!%*?&]/, 'Include a special character (@$!%*?&)')

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginForm = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Use at least 3 characters')
      .max(50, 'Use at most 50 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Letters, numbers, underscores and hyphens only'),
    email: z.email('Enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type RegisterForm = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address'),
})
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
