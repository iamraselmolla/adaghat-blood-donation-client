"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Droplet, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

const identifierSchema = z
  .string()
  .min(3, "Required")
  .refine(
    (val) => /^\S+@\S+\.\S+$/.test(val) || /^\+?[0-9]{10,14}$/.test(val),
    "Enter a valid email or phone number"
  );

const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(6, "Minimum 6 characters"),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    identifier: identifierSchema,
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  async function onLogin(values: LoginForm) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await authService.login(values);
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSignup(values: SignupForm) {
    // Public signup registers a MEMBER by default; staff roles are created by Super Admin.
    setServerError(null);
    setIsSubmitting(true);
    try {
      await authService.registerStaff({
        name: values.name,
        identifier: values.identifier,
        password: values.password,
        role: "MEMBER",
      });
      const res = await authService.login({ identifier: values.identifier, password: values.password });
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-glass-lg mb-3">
            <Droplet className="h-7 w-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">LifeDrop Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Blood Donation Management Platform</p>
        </div>

        <Card className="p-1">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {serverError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                >
                  {serverError}
                </motion.p>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="identifier">Email or Phone Number</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="identifier"
                        placeholder="you@example.com or +8801XXXXXXXXX"
                        className="pl-10"
                        {...registerLogin("identifier")}
                      />
                    </div>
                    {loginErrors.identifier && (
                      <p className="text-xs text-destructive">{loginErrors.identifier.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...registerLogin("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-xs text-destructive">{loginErrors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" placeholder="Jane Doe" className="pl-10" {...registerSignup("name")} />
                    </div>
                    {signupErrors.name && <p className="text-xs text-destructive">{signupErrors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="s-identifier">Email or Phone Number</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="s-identifier"
                        placeholder="you@example.com or +8801XXXXXXXXX"
                        className="pl-10"
                        {...registerSignup("identifier")}
                      />
                    </div>
                    {signupErrors.identifier && (
                      <p className="text-xs text-destructive">{signupErrors.identifier.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="s-password">Password</Label>
                    <Input id="s-password" type="password" placeholder="••••••••" {...registerSignup("password")} />
                    {signupErrors.password && (
                      <p className="text-xs text-destructive">{signupErrors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="s-confirm">Confirm Password</Label>
                    <Input id="s-confirm" type="password" placeholder="••••••••" {...registerSignup("confirmPassword")} />
                    {signupErrors.confirmPassword && (
                      <p className="text-xs text-destructive">{signupErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing you agree to LifeDrop's Terms & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
