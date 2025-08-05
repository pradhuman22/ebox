import z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty({ message: 'email is required' }).email({ message: 'Invalid email' }),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .nonempty({ message: 'password is required' })
    .min(6, { message: 'password must be atleast 6 characters or more' }),
  confirmPassword: z
    .string()
    .nonempty({ message: 'password is required' })
    .min(6, { message: 'password must be atleast 6 characters or more' }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'name is required' })
    .min(1, { message: 'name must be atleast 3 characters or more' })
    .trim(),
  email: z.string().nonempty({ message: 'email is required' }).email({ message: 'Invalid email' }),
  password: z
    .string()
    .nonempty({ message: 'password is required' })
    .min(6, { message: 'password must be atleast 6 characters or more' }),
});

export const loginSchema = z.object({
  email: z.string().nonempty({ message: 'email is required' }).email({ message: 'Invalid email' }),
  password: z
    .string()
    .nonempty({ message: 'password is required' })
    .min(6, { message: 'password must be atleast 6 characters or more' }),
});

export const profileSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: 'Fullname is required' })
      .min(3, { message: 'Fullname must be atleast 3 characters or more.' }),
    email: z
      .string()
      .nonempty({ message: 'Email is required' })
      .email({ message: 'Invalid Email' }),
    image: z.string().optional(),
    contact: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    currentPassword: z.optional(z.string()),
    password: z.optional(z.string()),
    confirmPassword: z.optional(z.string()),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Confirm Password And Password doesn't match.",
    path: ['confirmPassword'],
  });
