"use client";
import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const estadosBrasileiros = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

const baseSchema = z.object({
  email: z.string().email("Email inválido"),
  phone: z.string().min(14, "Telefone inválido"),
});

const collaboratorTeacherSchema = baseSchema.extend({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, `Tamanho máximo do arquivo é 5MB.`),
});

const subscriberSchema = baseSchema.extend({
  firstName: z.string().min(2, "Nome é obrigatório"),
  lastName: z.string().min(2, "Sobrenome é obrigatório"),
  state: z.string().min(2, "Estado é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  photo: z.instanceof(File).optional(),
});

const formSchema = z.discriminatedUnion("userType", [
  collaboratorTeacherSchema.extend({ userType: z.literal("collaborator") }),
  collaboratorTeacherSchema.extend({ userType: z.literal("teacher") }),
  subscriberSchema.extend({ userType: z.literal("subscriber") }),
]);

export type FormValues = z.infer<typeof formSchema>;

interface AddUserDialogProps {}

export function CreateUserDialog({}: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<
    "collaborator" | "teacher" | "subscriber"
  >("subscriber");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "subscriber",
      email: "",
      phone: "",
    },
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        form.setValue("photo", file);
      }
    },
    [form]
  );

  const removePhoto = useCallback(() => {
    setPreviewUrl(null);
    form.setValue("photo", undefined);
  }, [form]);

  function onSubmit(values: FormValues) {
    setIsOpen(false);
    form.reset();
    setPreviewUrl(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Avatar className="w-32 h-32">
                              <AvatarImage
                                src={previewUrl || undefined}
                                className="object-cover"
                                alt="Preview"
                              />
                              <AvatarFallback>
                                {userType === "subscriber"
                                  ? "S"
                                  : userType === "teacher"
                                  ? "T"
                                  : "C"}
                              </AvatarFallback>
                            </Avatar>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="absolute bottom-0 right-0"
                                >
                                  <Camera className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onSelect={() =>
                                    document
                                      .getElementById("photo-upload")
                                      ?.click()
                                  }
                                >
                                  {previewUrl
                                    ? "Alterar foto"
                                    : "Adicionar foto"}
                                </DropdownMenuItem>
                                {previewUrl && (
                                  <DropdownMenuItem onSelect={removePhoto}>
                                    Remover foto
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormLabel className="text-center">
                    {userType === "subscriber" ? "Foto (opcional)" : "Foto"}
                  </FormLabel>
                </div>
                <div className="w-full md:w-2/3">
                  <Tabs
                    value={userType}
                    onValueChange={(value) => {
                      setUserType(
                        value as "collaborator" | "teacher" | "subscriber"
                      );
                      form.setValue(
                        "userType",
                        value as "collaborator" | "teacher" | "subscriber"
                      );
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="collaborator">
                        Colaborador
                      </TabsTrigger>
                      <TabsTrigger value="teacher">Professor</TabsTrigger>
                      <TabsTrigger value="subscriber">Assinante</TabsTrigger>
                    </TabsList>
                    <TabsContent value="collaborator">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl>
                                <Input
                                  // mask="xxx.xxx.xxx-xx"
                                  placeholder="000.000.000-00"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="teacher">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl>
                                <Input
                                  // mask="xxx.xxx.xxx-xx"
                                  placeholder="000.000.000-00"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="subscriber">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem className="flex flex-col justify-between">
                                <FormLabel>Estado</FormLabel>
                                <Combobox
                                  options={estadosBrasileiros}
                                  value={field.value}
                                  onSetValue={field.onChange}
                                  placeholder="Digite para buscar..."
                                  emptyMessage="Nenhum estado encontrado."
                                  searchPlaceholder="Selecione um estado"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        // mask="(xx) x xxxx-xxxx"
                        placeholder="(00) 0 0000-0000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Adicionar Usuário
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
