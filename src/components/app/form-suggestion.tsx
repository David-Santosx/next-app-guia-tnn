"use client"

import { Badge } from "../ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  suggestion: z.string().min(10, {
    message: "Sugestão deve ter pelo menos 10 caracteres.",
  }),
});

export default function FormSuggestion() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      suggestion: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <form className="w-full bg-brand-primary/20 rounded-md p-4 drop-shadow-sm" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Badge className="bg-brand-primary text-brand-secondary">
          <h3>Nós queremos saber!</h3>
        </Badge>
        <h4 className="text-brand-black text-size-default font-bold">
          O que você acha que deve melhorar na nossa cidade?
        </h4>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input className="bg-white" placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="suggestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sugestão</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Compartilhe sua sugestão para melhorar nossa cidade" 
                      className="min-h-[120px] bg-white resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-brand-secondary hover:bg-brand-secondary hover:brightness-150 hover:scale-105 rounded-3xl cursor-pointer"
            >
              Enviar Sugestão
            </Button>
          </form>
        </Form>
      </div>
    </form>
  );
}
