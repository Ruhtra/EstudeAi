// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { ImageUploadField } from "./_components/image-upload-field";

// const formSchema = z.object({
//   image: z.optional(z.instanceof(File)),
// });

// export default function Page() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       image: undefined,
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//   }
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Image Upload</h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <ImageUploadField
//             form={form}
//             name="image"
//             label="Profile Image"
//             initialImageUrl="/images/fundo_cla.png"
//           />

//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </div>
//   );
// }
