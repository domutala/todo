import "./index.css";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import type { Todo } from "./interfaces/Todo";

const formSchema = z.object({
  title: z.string().min(2).max(50),
});

export function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/todo", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = (await response.json()) as Todo;
        form.reset();

        toast(data.title, {
          description:
            "Parfait ! Votre tâche est dans la liste. Qu'est-ce que vous ferez ensuite ?",
          position: "bottom-left",
          descriptionClassName: "w-full text-sm",
          action: {
            label: "Ouvrir",
            onClick: () => console.log("Undo"),
          },
        });
      }
    } catch (error) {}
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-[662px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-[7px] relative">
                  <FormControl className="relative">
                    <Textarea
                      className="h-[100px] resize-none focus-visible:shadow-0 rounded-lg border-0 focus-visible:ring-0 bg-slate-50 ease-in duration-300 focus:border-slate-800 focus-within:shadow-lg"
                      placeholder="Type your message here."
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // Empêche le saut de ligne
                          form.handleSubmit(onSubmit)(); // Soumet le formulaire
                        }
                      }}
                    />
                  </FormControl>

                  <FormMessage className="px-3" />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              Soumettre
            </Button>
          </form>
        </Form>
      </div>

      <Toaster />
    </>
  );
}

export default App;
