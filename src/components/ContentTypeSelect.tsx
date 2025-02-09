import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { ImageIcon, FileTextIcon } from "lucide-react";
  
  interface ContentTypeSelectProps {
    value: string;
    onChange: (value: "text" | "image") => void;
    onTypeChange?: (value: "text" | "image") => void;
    label?: string;
    className?: string;
  }
  
  export function ContentTypeSelect({
    value,
    onChange,
    onTypeChange,
    label = "Tipo de conteúdo",
    className = "",
  }: ContentTypeSelectProps) {
    return (
      <FormItem className={className}>
        {label && <FormLabel className="text-sm font-medium">{label}</FormLabel>}
        <Select
          value={value}
          onValueChange={(value: "text" | "image") => {
            onChange(value);
            if (onTypeChange) {
              onTypeChange(value);
            }
          }}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="text">
              <div className="flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                <span>Texto</span>
              </div>
            </SelectItem>
            <SelectItem value="image">
              <div className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                <span>Imagem</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage className="text-xs" />
      </FormItem>
    );
  }