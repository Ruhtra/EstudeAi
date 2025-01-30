// "use client";

// import { useState, useEffect } from "react";
// import type { UseFormReturn } from "react-hook-form";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X } from "lucide-react";

// interface ImageUploadFieldProps {
//   form: UseFormReturn<any>;
//   name: string;
//   label: string;
//   initialImageUrl?: string;
// }

// export function ImageUploadField({
//   form,
//   name,
//   label,
//   initialImageUrl,
// }: ImageUploadFieldProps) {
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   useEffect(() => {
//     if (initialImageUrl) {
//       fetch(initialImageUrl)
//         .then((res) => res.blob())
//         .then((blob) => {
//           const file = new File([blob], "image.jpg", { type: blob.type });
//           form.setValue(name, file);
//           setPreviewUrl(initialImageUrl);
//         })
//         .catch((error) =>
//           console.error("Error fetching initial image:", error)
//         );
//     }
//   }, [initialImageUrl, form, name]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//       form.setValue(name, file);
//     }
//   };

//   const removeImage = () => {
//     setPreviewUrl(null);
//     form.setValue(name, undefined);
//   };

//   return (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>{label}</FormLabel>
//           <FormControl>
//             <div className="flex flex-col items-center space-y-4">
//               {previewUrl ? (
//                 <div className="relative">
//                   <img
//                     src={previewUrl || "/placeholder.svg"}
//                     alt="Preview"
//                     className="max-w-xs max-h-64 object-contain"
//                   />
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     size="icon"
//                     className="absolute top-0 right-0"
//                     onClick={removeImage}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500">No image</span>
//                 </div>
//               )}
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="max-w-xs"
//               />
//             </div>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
