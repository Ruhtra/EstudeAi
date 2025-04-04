"use client";

import { useState, useEffect, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface ImageUploadFieldWithUrlProps {
  //TO-DO: Rmover esse eslint e tipar corretamente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  initialImageUrl?: string;
  isPending: boolean;
}

export function ImageUploadFieldWithUrl({
  form,
  name,
  initialImageUrl,
  isPending,
}: ImageUploadFieldWithUrlProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        form.setValue("content", file);
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });
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
      form.setValue(name, file);
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormControl>
            <div className="flex items-center space-x-2">
              <div className="flex-grow">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 hover:border-primary"
                  } ${
                    isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-primary"
                  }`}
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isPending}
                    id={`${name}-upload`}
                  />
                  <label htmlFor={`${name}-upload`} className="cursor-pointer">
                    {previewUrl ? (
                      <div className="max-w-full max-h-[300px] mx-auto relative">
                        <Image
                          width={300}
                          height={300}
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full max-h-[300px] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="py-10">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
