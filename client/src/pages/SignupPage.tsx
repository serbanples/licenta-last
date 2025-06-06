import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks"
import { routes } from "@/router/routeConfig"
import { signup } from "@/services/auth"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof formSchema>

export const SignupPage = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  })

  const  [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (values: SignupFormValues) => { setIsLoading(true); return signup(values); },
    onError: () => {
      setIsLoading(false)
      toast.error('Invalid email or password');
    },
    onSuccess: () => {
      setIsLoading(false)
      toast.success('Account created successfully', 'Please verify your email address');
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <h1 className="text-2xl font-bold">Create Account</h1>
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
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="text-center pt-2">
                <span className="text-sm text-gray-600 mr-2">Already have an account?</span>
                <Button className="cursor-pointer" variant="link" size="sm" onClick={() => navigate(routes.login)}>
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}