"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const adminSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres",
  }),
  adminKey: z.string().min(1, {
    message: "A chave de administrador é obrigatória",
  }),
})

type AdminFormValues = z.infer<typeof adminSchema>

export default function AddAdminPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      adminKey: "",
    },
  })

  async function onSubmit(data: AdminFormValues) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Falha ao criar administrador")
      }

      setSuccess(true)
      form.reset()
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/admins")
      }, 2000)
    } catch (err) {
      console.error("Error creating admin:", err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao criar o administrador")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white">Adicionar Administrador</h1>
        <p className="text-slate-400">Crie uma nova conta de administrador para o sistema</p>
      </div>

      <div className="flex items-center mb-4">
        <Link href="/dashboard/admins">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Novo Administrador</CardTitle>
          <CardDescription className="text-slate-400">
            Preencha os dados abaixo para criar um novo administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-300 p-4 rounded-md mb-6 text-sm">
              <p className="font-medium">Erro</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-900/20 border border-emerald-800 text-emerald-300 p-4 rounded-md mb-6 text-sm">
              <p className="font-medium">Sucesso</p>
              <p>Administrador criado com sucesso! Redirecionando...</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Nome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do administrador" 
                          className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-slate-700 focus-visible:ring-offset-slate-900"
                          disabled={isSubmitting}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@exemplo.com" 
                          type="email"
                          className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-slate-700 focus-visible:ring-offset-slate-900"
                          disabled={isSubmitting}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Senha segura" 
                          type="password"
                          className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-slate-700 focus-visible:ring-offset-slate-900"
                          disabled={isSubmitting}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500 text-xs">
                        A senha deve ter pelo menos 8 caracteres
                      </FormDescription>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Chave de Administrador</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Chave secreta" 
                          type="password"
                          className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-slate-700 focus-visible:ring-offset-slate-900"
                          disabled={isSubmitting}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500 text-xs">
                        Chave de segurança para criação de administradores
                      </FormDescription>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-800 mt-8">
                <Link href="/dashboard/admins" className="w-full sm:w-auto">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="bg-slate-700 hover:bg-slate-600 text-white w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Administrador"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}