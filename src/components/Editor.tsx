import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
// import { Button } from "@/components/ui/button";
// import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isPending: boolean; // New prop
  className?: string;
}

export function Editor({
  content,
  onChange,
  placeholder,
  isPending,
  className,
}: EditorProps) {
  const { theme } = useTheme();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Underline,
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          "focus:outline-none h-[100%] min-h-[3em] p-1",
          isPending && "opacity-50 pointer-events-none"
        ),
      },
    },
  });

  //TO-DO: This code is a workaround and should be refactored for better reliability and maintainability.
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0 && editor && content) {
      // editor.commands.setContent(JSON.parse(content));
      editor.commands.setContent(content);
      setCount(1);
    }
  }, [content, editor, count]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent
        className={cn(
          `prose ${theme == "dark" && "prose-invert"} prose-purple whitespace-pre-wrap`,
          isPending && "pointer-events-none",
          className
        )}
        editor={editor}
      />
      {/* {editor && (
        <>
          <BubbleMenu
            className="shadow-xl border bg-primary rounded-lg overflow-hidden divide-x-2 divide-secondary"
            editor={editor}
          >
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "rounded-none hover:bg-secondary hover:text-primary",
                editor.isActive("bold") ? "bg-secondary text-primary" : ""
              )}
              type="button"
              size={"icon"}
            >
              <BoldIcon />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "rounded-none hover:bg-secondary hover:text-primary",
                editor.isActive("italic") ? "bg-secondary text-primary" : ""
              )}
              type="button"
              size={"icon"}
            >
              <ItalicIcon />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "rounded-none hover:bg-secondary hover:text-primary",
                editor.isActive("underline") ? "bg-secondary text-primary" : ""
              )}
              type="button"
              size={"icon"}
            >
              <UnderlineIcon />
            </Button>
          </BubbleMenu>
        </>
      )} */}
    </>
  );
}
