'use client';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { authClient } from '@/auth-client';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InputPassword } from '../_components/InputPassword';
import SocialLoginButton from '../_components/SocialLoginButton';
import { loginSchema } from '@/schema/authSchema';

type FormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [isPending, setPending] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async ({ email, password }: FormValues) => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          router.push('/dashboard/profile');
          router.refresh();
        },
        onError: ctx => {
          console.log('error', ctx);
          if (ctx.error.status === 403) {
            toast.error(`Please verify your email address`, {
              style: { color: 'red' },
            });
          }
          toast.error(`${ctx.error.message ?? 'Something went wrong'}`, {
            style: { color: 'red' },
          });
        },
      },
    );

    setPending(false);
  };
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Welcome back!</CardTitle>
          <CardDescription className="text-muted-foreground font-light">
            Enter your login credential to continue your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
              <div className="space-y-4">
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-inherit">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="eg: hari@example.com"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor={field.name} className="text-inherit">
                          Password
                        </FormLabel>
                        <Link
                          href={'/forgot-password'}
                          className="text-muted-foreground text-xs hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <FormControl>
                        <InputPassword
                          id={field.name}
                          placeholder="*********"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={isPending} className="cursor-pointer">
                {isPending && <Loader2Icon className="animate-spin" />}
                {isPending ? 'Logging user...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">Or continue with</span>
            </div>
          </div>
          {/* social login buttons */}
          <SocialLoginButton />
        </CardFooter>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            Don't have an account yet?{' '}
            <Link href={'/register'} className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
