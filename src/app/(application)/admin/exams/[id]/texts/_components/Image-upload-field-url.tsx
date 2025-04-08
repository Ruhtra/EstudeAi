"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  isPending?: boolean;
  initialUrl?: string | null;
}

export function ImageUploadFieldWithUrl({
  form,
  name,
  isPending = false,
  initialUrl = null,
}: ImageUploadFieldWithUrlProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);

  // Function to fetch an image from URL and convert to File
  const fetchImageAsFile = useCallback(
    async (url: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = url.split("/").pop() || "image.jpg";
        const fileType = blob.type || "image/jpeg";
        const file = new File([blob], filename, { type: fileType });

        // Set the file in the form
        form.setValue(name, file);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error fetching image:", error);
        // Keep the URL as preview even if fetch fails
        setPreviewUrl(url);
      }
    },
    [form, name]
  );

  // Set initial form value if URL is provided
  useEffect(() => {
    if (initialUrl && !form.getValues(name)) {
      // If we have an initial URL but no file in the form yet,
      // we'll fetch the image and convert it to a File
      fetchImageAsFile(initialUrl);
    }
  }, [initialUrl, form, name, fetchImageAsFile]);

  const handleImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        // Update form value with the file
        form.setValue(name, file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Clear form value and preview if file is null
        form.setValue(name, null);
        setPreviewUrl(null);
      }
    },
    [form, name]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleImageChange(acceptedFiles[0]);
      }
    },
    [handleImageChange]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: isPending,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
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
                  } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={isPending}
                    id={`${name}-upload`}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  <label htmlFor={`${name}-upload`} className="cursor-pointer">
                    {previewUrl ? (
                      <div className="max-w-full max-h-[300px] mx-auto relative">
                        <Image
                          width={300}
                          height={300}
                          src={previewUrl || "/placeholder.svg"}
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
