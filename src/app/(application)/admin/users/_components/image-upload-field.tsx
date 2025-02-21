"use client";

import { useState, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@prisma/client";

interface ImageUploadFieldProps {
  //TO-DO: Rmover esse eslint e tipar corretamente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  initialImageUrl?: string;

  isPending: boolean;
  userType: UserRole;
}

export function ImageUploadField({
  form,
  name,
  initialImageUrl,

  userType,
  isPending,
}: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      fetch(initialImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "image.jpg", { type: blob.type });
          form.setValue(name, file);
          setPreviewUrl(initialImageUrl);
        })
        .catch((error) =>
          console.error("Error fetching initial image:", error)
        );
    }
  }, [initialImageUrl, form, name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue(name, file);
    }
  };

  const removeImage = () => {
    //TO-DO: Verificar bug de foco no ao remover imagem
    setPreviewUrl(null);
    form.setValue(name, undefined);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={previewUrl || undefined}
                  className="object-cover"
                  alt="Preview"
                  fetchPriority="high"
                />
                <AvatarFallback>
                  {userType === UserRole.student
                    ? "S"
                    : userType === UserRole.teacher
                      ? "T"
                      : "C"}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isPending}>
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
                      document.getElementById("photo-upload")?.click()
                    }
                  >
                    {previewUrl ? "Alterar foto" : "Adicionar foto"}
                  </DropdownMenuItem>
                  {previewUrl && (
                    <DropdownMenuItem onSelect={removeImage}>
                      Remover foto
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isPending}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
