import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, whoami } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/router/routeConfig';
import { useAuth, useToast } from '@/hooks';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { Loader2 } from 'lucide-react';
import { UserContext } from '@/services/types';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof formSchema>;

export const LoginPage: React.FC = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const  [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useAuth();
  const qc = useQueryClient();

  const navigate = useNavigate();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => { setIsLoading(true); return login(values); },
    onError: () => {
      setIsLoading(false)
      toast.error('Invalid email or password');
    },
    onSuccess: async () => {
      const userCtx: UserContext = await qc.fetchQuery({queryKey: ['whoami'], queryFn: whoami});
      setUser(userCtx);
      navigate(routes.home, { replace: true });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
              <div className="text-center pt-2">
                <span className="text-sm text-gray-600 mr-2">Don't have an account?</span>
                <Button className="cursor-pointer" variant="link" size="sm" onClick={() => navigate(routes.signup)}>
                  Sign up
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
