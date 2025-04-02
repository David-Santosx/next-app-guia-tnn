"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";

// Define the form schema with Zod
const photoFormSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.string().min(1, {
    message: "Por favor, selecione uma categoria.",
  }),
  dateTaken: z.string().optional(),
  photographer: z.string().optional(),
  file: z.instanceof(File, {
    message: "Por favor, selecione uma imagem para upload.",
  }).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    {
      message: "A imagem deve ter no máximo 5MB.",
    }
  ).refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Apenas imagens nos formatos JPG, PNG e WebP são permitidas.",
    }
  ),
});

type PhotoFormValues = z.infer<typeof photoFormSchema>;

export default function AddPhotoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "general",
      dateTaken: "",
      photographer: "",
    },
  });

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the file in the form
    form.setValue("file", file, { shouldValidate: true });

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);

    // Clean up the preview URL when component unmounts
    return () => URL.revokeObjectURL(fileUrl);
  };

  // Handle form submission
  async function onSubmit(data: PhotoFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("location", data.location || "");
      formData.append("category", data.category);
      formData.append("dateTaken", data.dateTaken || "");
      formData.append("photographer", data.photographer || "");

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao fazer upload da foto");
      }

      // Redirect to photos list on success
      router.push("/dashboard/fotos");
      router.refresh();
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao fazer upload da foto");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-white">Adicionar Foto</h1>
          <p className="text-slate-400">Adicione uma nova foto à galeria</p>
        </div>
        <Link href="/dashboard/fotos">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Informações da Foto</CardTitle>
          <CardDescription>
            Preencha os detalhes da foto que você deseja adicionar à galeria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite o título da foto" 
                            className="bg-slate-800 border-slate-700 text-white"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Um título descritivo para a foto.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Digite uma descrição para a foto" 
                            className="bg-slate-800 border-slate-700 text-white resize-none min-h-[100px]"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Uma descrição detalhada do que a foto representa.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite o local onde a foto foi tirada" 
                            className="bg-slate-800 border-slate-700 text-white"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          O local onde a foto foi tirada.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}

                  />

                  <FormField
                      control={form.control}
                      name="photographer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foto tirada por</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite o nome do fotógrafo" 
                              className="bg-slate-800 border-slate-700 text-white"
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            O nome da pessoa que tirou a foto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="general">Geral</SelectItem>
                            <SelectItem value="landscape">Paisagem</SelectItem>
                            <SelectItem value="city">Cidade</SelectItem>
                            <SelectItem value="event">Eventos</SelectItem>
                            <SelectItem value="people">Pessoas</SelectItem>
                            <SelectItem value="architecture">Arquitetura</SelectItem>
                            <SelectItem value="nature">Natureza</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          A categoria que melhor descreve a foto.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateTaken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Foto</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-slate-800 border-slate-700 text-white"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A data em que a foto foi tirada.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-4">
                            <div 
                              className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:bg-slate-800/50 transition-colors cursor-pointer"
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              {preview ? (
                                <div className="relative h-48 w-full">
                                  <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="h-full w-full object-contain mx-auto"
                                  />
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center">
                                  <ImagePlus className="h-12 w-12 text-slate-500 mb-2" />
                                  <p className="text-sm text-slate-400">
                                    Clique para selecionar uma imagem ou arraste e solte aqui
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    JPG, PNG ou WebP (máx. 5MB)
                                  </p>
                                </div>
                              )}
                              <input
                                id="file-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                              />
                            </div>
                            {form.formState.errors.file && (
                              <p className="text-sm text-red-500">
                                {form.formState.errors.file.message}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <CardFooter className="flex justify-end px-0 pt-4 border-t border-slate-800">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Salvar Foto"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}