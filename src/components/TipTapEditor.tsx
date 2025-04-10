"use client";

import type React from "react";

import { useEditor, EditorContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  StrikethroughIcon,
  ChevronDown,
} from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import FontSize from "@tiptap/extension-font-size";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isPending: boolean;
}

// Alternativa 1: Barra de ferramentas com abas horizontais
export function TiptapEditor({
  content,
  onChange,
  placeholder,
  isPending,
}: TiptapEditorProps) {
  const { theme } = useTheme();
  const [customColor, setCustomColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        heading: false,
      }),
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Color,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content ? JSON.parse(content) : "",
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[30svh] mx-auto focus:outline-none",
          isPending && "opacity-50 pointer-events-none"
        ),
      },
    },
  });

  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0 && editor && content) {
      editor.commands.setContent(JSON.parse(content));
      setCount(1);
    }
  }, [content, editor, count]);

  if (!editor) {
    return null;
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    editor.chain().focus().setColor(newColor).run();
  };

  return (
    <div className={cn("border rounded-md p-2", isPending && "opacity-50")}>
      {/* Layout para desktop */}
      <div className="hidden md:flex flex-wrap gap-4 mb-2 border-b pb-2">
        {/* Grupo de Formatação de Fonte */}
        <div>
          <div className="text-xs font-medium mb-1 text-muted-foreground">
            Fonte
          </div>
          <div className="flex flex-wrap gap-1">
            <Toggle
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              aria-label="Negrito"
              disabled={isPending}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              aria-label="Itálico"
              disabled={isPending}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive("underline")}
              onPressedChange={() =>
                editor.chain().focus().toggleUnderline().run()
              }
              aria-label="Sublinhado"
              disabled={isPending}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              aria-label="Tachado"
              disabled={isPending}
            >
              <StrikethroughIcon className="h-4 w-4" />
            </Toggle>

            {/* Tamanho do texto */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isPending}>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                  <Type className="h-4 w-4 mr-1" />
                  <span>
                    {editor.getAttributes("textStyle").fontSize || "16px"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  "8px",
                  "10px",
                  "12px",
                  "14px",
                  "16px",
                  "18px",
                  "20px",
                  "24px",
                  "30px",
                  "36px",
                ].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() =>
                      editor.chain().focus().setFontSize(size).run()
                    }
                    className="cursor-pointer"
                  >
                    <span style={{ fontSize: size }}>{size}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cor do texto */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isPending}>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 border border-gray-300"
                      style={{
                        backgroundColor:
                          editor.getAttributes("textStyle").color || "#000000",
                        borderRadius: "2px",
                      }}
                    />
                    <span className="sr-only">Cor do texto</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-0">
                <div className="p-2 border-b">
                  <div className="text-sm font-medium mb-2">Cor da Fonte</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 border cursor-pointer"
                      onClick={() =>
                        editor.chain().focus().setColor("#000000").run()
                      }
                    />
                    <span className="text-xs">Automático</span>
                  </div>

                  {/* Grade de cores em tons */}
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      "#FFFFFF",
                      "#F2F2F2",
                      "#D9D9D9",
                      "#BFBFBF",
                      "#A6A6A6",
                      "#808080",
                      "#595959",
                      "#262626",
                      "#FFE6E6",
                      "#FFCCCC",
                      "#FF9999",
                      "#FF6666",
                      "#FF3333",
                      "#FF0000",
                      "#CC0000",
                      "#800000",
                      "#FFF2E6",
                      "#FFE6CC",
                      "#FFCC99",
                      "#FFB366",
                      "#FF9933",
                      "#FF8000",
                      "#CC6600",
                      "#804000",
                      "#FFFBE6",
                      "#FFF8CC",
                      "#FFF199",
                      "#FFEB66",
                      "#FFE433",
                      "#FFDD00",
                      "#CCAC00",
                      "#806C00",
                      "#F2FFE6",
                      "#E6FFCC",
                      "#CCFF99",
                      "#B3FF66",
                      "#99FF33",
                      "#80FF00",
                      "#66CC00",
                      "#408000",
                      "#E6FFF2",
                      "#CCFFE6",
                      "#99FFCC",
                      "#66FFB3",
                      "#33FF99",
                      "#00FF80",
                      "#00CC66",
                      "#008040",
                      "#E6F2FF",
                      "#CCE6FF",
                      "#99CCFF",
                      "#66B3FF",
                      "#3399FF",
                      "#0080FF",
                      "#0066CC",
                      "#004080",
                      "#F2E6FF",
                      "#E6CCFF",
                      "#CC99FF",
                      "#B366FF",
                      "#9933FF",
                      "#8000FF",
                      "#6600CC",
                      "#400080",
                    ].map((color, index) => (
                      <div
                        key={index}
                        className="w-5 h-5 border cursor-pointer hover:border-black"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          editor.chain().focus().setColor(color).run()
                        }
                      />
                    ))}
                  </div>

                  {/* Cores padrão */}
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-1">Cores Padrão</div>
                    <div className="grid grid-cols-10 gap-1">
                      {[
                        "#FF0000",
                        "#FF8000",
                        "#FFFF00",
                        "#80FF00",
                        "#00FF00",
                        "#00FF80",
                        "#00FFFF",
                        "#0080FF",
                        "#0000FF",
                        "#8000FF",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="w-5 h-5 border cursor-pointer hover:border-black"
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            editor.chain().focus().setColor(color).run()
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Seletor de cor personalizada */}
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-1">
                      Cor Personalizada
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={customColor}
                        onChange={handleCustomColorChange}
                        className="w-10 h-8 p-1 cursor-pointer"
                      />
                      <span className="text-xs">{customColor}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Separador vertical */}
        <div className="w-px h-14 bg-border self-center" />

        {/* Grupo de Listas */}
        <div>
          <div className="text-xs font-medium mb-1 text-muted-foreground">
            Listas
          </div>
          <div className="flex flex-wrap gap-1">
            <Toggle
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              aria-label="Lista com marcadores"
              disabled={isPending}
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              aria-label="Lista numerada"
              disabled={isPending}
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        {/* Separador vertical */}
        <div className="w-px h-14 bg-border self-center" />

        {/* Grupo de Alinhamento de Parágrafo */}
        <div>
          <div className="text-xs font-medium mb-1 text-muted-foreground">
            Parágrafo
          </div>
          <div className="flex flex-wrap gap-1">
            <Toggle
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
              aria-label="Alinhar à esquerda"
              disabled={isPending}
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              aria-label="Centralizar"
              disabled={isPending}
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
              aria-label="Alinhar à direita"
              disabled={isPending}
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: "justify" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              aria-label="Justificar"
              disabled={isPending}
            >
              <AlignJustify className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </div>

      {/* Layout para mobile - Abas horizontais */}
      <div className="md:hidden mb-2 border-b pb-2">
        <Tabs defaultValue="fonte" className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="fonte">Fonte</TabsTrigger>
            <TabsTrigger value="listas">Listas</TabsTrigger>
            <TabsTrigger value="paragrafo">Parágrafo</TabsTrigger>
          </TabsList>

          <TabsContent value="fonte" className="mt-0 space-y-2">
            <div className="flex flex-wrap gap-1">
              <Toggle
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                aria-label="Negrito"
                disabled={isPending}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                aria-label="Itálico"
                disabled={isPending}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive("underline")}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                aria-label="Sublinhado"
                disabled={isPending}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                aria-label="Tachado"
                disabled={isPending}
              >
                <StrikethroughIcon className="h-4 w-4" />
              </Toggle>

              {/* Tamanho do texto */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isPending}>
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                    <Type className="h-4 w-4 mr-1" />
                    <span>
                      {editor.getAttributes("textStyle").fontSize || "16px"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[
                    "8px",
                    "10px",
                    "12px",
                    "14px",
                    "16px",
                    "18px",
                    "20px",
                    "24px",
                    "30px",
                    "36px",
                  ].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() =>
                        editor.chain().focus().setFontSize(size).run()
                      }
                      className="cursor-pointer"
                    >
                      <span style={{ fontSize: size }}>{size}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cor do texto */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isPending}>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 border border-gray-300"
                        style={{
                          backgroundColor:
                            editor.getAttributes("textStyle").color ||
                            "#000000",
                          borderRadius: "2px",
                        }}
                      />
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-0">
                  <div className="p-2 border-b">
                    <div className="text-sm font-medium mb-2">Cor da Fonte</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 border cursor-pointer"
                        onClick={() =>
                          editor.chain().focus().setColor("#000000").run()
                        }
                      />
                      <span className="text-xs">Automático</span>
                    </div>

                    {/* Grade de cores em tons */}
                    <div className="grid grid-cols-8 gap-1">
                      {[
                        "#FFFFFF",
                        "#F2F2F2",
                        "#D9D9D9",
                        "#BFBFBF",
                        "#A6A6A6",
                        "#808080",
                        "#595959",
                        "#262626",
                        "#FFE6E6",
                        "#FFCCCC",
                        "#FF9999",
                        "#FF6666",
                        "#FF3333",
                        "#FF0000",
                        "#CC0000",
                        "#800000",
                        "#FFF2E6",
                        "#FFE6CC",
                        "#FFCC99",
                        "#FFB366",
                        "#FF9933",
                        "#FF8000",
                        "#CC6600",
                        "#804000",
                        "#FFFBE6",
                        "#FFF8CC",
                        "#FFF199",
                        "#FFEB66",
                        "#FFE433",
                        "#FFDD00",
                        "#CCAC00",
                        "#806C00",
                        "#F2FFE6",
                        "#E6FFCC",
                        "#CCFF99",
                        "#B3FF66",
                        "#99FF33",
                        "#80FF00",
                        "#66CC00",
                        "#408000",
                        "#E6FFF2",
                        "#CCFFE6",
                        "#99FFCC",
                        "#66FFB3",
                        "#33FF99",
                        "#00FF80",
                        "#00CC66",
                        "#008040",
                        "#E6F2FF",
                        "#CCE6FF",
                        "#99CCFF",
                        "#66B3FF",
                        "#3399FF",
                        "#0080FF",
                        "#0066CC",
                        "#004080",
                        "#F2E6FF",
                        "#E6CCFF",
                        "#CC99FF",
                        "#B366FF",
                        "#9933FF",
                        "#8000FF",
                        "#6600CC",
                        "#400080",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="w-5 h-5 border cursor-pointer hover:border-black"
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            editor.chain().focus().setColor(color).run()
                          }
                        />
                      ))}
                    </div>

                    {/* Cores padrão */}
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">
                        Cores Padrão
                      </div>
                      <div className="grid grid-cols-10 gap-1">
                        {[
                          "#FF0000",
                          "#FF8000",
                          "#FFFF00",
                          "#80FF00",
                          "#00FF00",
                          "#00FF80",
                          "#00FFFF",
                          "#0080FF",
                          "#0000FF",
                          "#8000FF",
                        ].map((color, index) => (
                          <div
                            key={index}
                            className="w-5 h-5 border cursor-pointer hover:border-black"
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              editor.chain().focus().setColor(color).run()
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Seletor de cor personalizada */}
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">
                        Cor Personalizada
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={customColor}
                          onChange={handleCustomColorChange}
                          className="w-10 h-8 p-1 cursor-pointer"
                        />
                        <span className="text-xs">{customColor}</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabsContent>

          <TabsContent value="listas" className="mt-0 space-y-2">
            <div className="flex flex-wrap gap-1">
              <Toggle
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                aria-label="Lista com marcadores"
                disabled={isPending}
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                aria-label="Lista numerada"
                disabled={isPending}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </div>
          </TabsContent>

          <TabsContent value="paragrafo" className="mt-0 space-y-2">
            <div className="flex flex-wrap gap-1">
              <Toggle
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                aria-label="Alinhar à esquerda"
                disabled={isPending}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                aria-label="Centralizar"
                disabled={isPending}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                aria-label="Alinhar à direita"
                disabled={isPending}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                aria-label="Justificar"
                disabled={isPending}
              >
                <AlignJustify className="h-4 w-4" />
              </Toggle>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditorContent
        className={cn(
          `prose ${theme == "dark" && "prose-invert"} prose-purple whitespace-pre-wrap`,
          isPending && "pointer-events-none"
        )}
        editor={editor}
      />
    </div>
  );
}

export function MeGenerateHTML(json: string) {
  if (json) {
    const htmlContent: string = generateHTML(JSON.parse(json), [
      Document,
      Paragraph,
      Text,
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        heading: false,
      }),
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Color,
      Placeholder.configure({
        placeholder: "BUUUUUUUUG",
      }),
    ]);

    return htmlContent;
  }
  return "";
}
