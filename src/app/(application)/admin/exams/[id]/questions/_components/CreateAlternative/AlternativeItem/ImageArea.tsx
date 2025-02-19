import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { QuestionFormValues } from "../QuestionForm";
import { useDropzone } from "react-dropzone";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export interface ImageAreaProps {
  index: number;
  previewImage: string | null;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
}
export function ImageArea({
  index,
  previewImage,
  setPreviewImage,
}: ImageAreaProps) {
  const { setValue } = useFormContext<QuestionFormValues>();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreviewImage(result);
          setValue(`alternatives.${index}.content`, result);
          setValue(`alternatives.${index}.contentType`, "image");
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue, index, setPreviewImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {previewImage ? (
          <div className="max-w-full max-h-[300px] mx-auto relative">
            <Image
              width={300}
              height={300}
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[300px] object-contain"
            />
          </div>
        ) : (
          <div className="py-10">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Arraste uma imagem ou clique para selecionar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
