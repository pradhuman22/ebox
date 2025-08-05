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
import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/schema/authSchema';

type FormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isPending, setPending] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async ({ email }: FormValues) => {
    await authClient.forgetPassword({
      email,
      redirectTo: '/reset-password',
      fetchOptions: {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast.success('Reset link sent to your email.', {
            style: { color: 'green' },
          });
          router.push('/login');
        },
        onError: ctx => {
          toast.error(ctx.error.message, {
            style: { color: 'red' },
          });
        },
      },
    });
    setPending(false);
  };
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Forgot Password</CardTitle>
          <CardDescription className="text-muted-foreground font-light">
            Enter your email to receive reset password email.
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
              </div>
              <Button disabled={isPending} className="cursor-pointer">
                {isPending && <LoaderIcon className="animate-spin" />}
                {isPending ? 'Sending reset email' : 'Send Reset Email'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            Remember Password?
            <Link href={'/login'} className="text-primary mx-2 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
