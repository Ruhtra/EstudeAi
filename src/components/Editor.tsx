import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

export interface EditorProps {
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Editor({
  placeHolder,
  value,
  onChange,
  className,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeHolder,
      }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn("outline-none h-[100%] min-h-[3em] p-1", className),
      },
    },
  });

  useEffect(() => {
    editor?.commands.setContent(value);
  }, [value]);

  return (
    <>
      <EditorContent
        editor={editor}
        onInput={() => {
          onChange(editor?.getHTML() || "");
        }}
      />
      {editor && (
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
      )}
    </>
  );
}
