"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError("Email ou senha inválidos. Por favor, tente novamente.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error during login:", error);
      setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Link href="/">
            <Image
              src="/brand/app-logo-horizontal.svg"
              alt="Guia TNN"
              width={180}
              height={72}
              className="mb-2 sm:mb-4 w-36 sm:w-44 md:w-48 h-auto"
              priority
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-primary text-center">
            Acesso ao Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 text-center max-w-[250px] sm:max-w-none">
            Entre com suas credenciais para acessar o painel administrativo
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg border border-brand-primary/10 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        type="email"
                        className="text-sm sm:text-base h-9 sm:h-10"
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="******" 
                        type="password"
                        className="text-sm sm:text-base h-9 sm:h-10"
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-sm sm:text-base h-9 sm:h-10 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-xs sm:text-sm text-brand-secondary hover:underline"
            >
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}