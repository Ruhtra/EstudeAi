"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryCLient";
import {
  ItemMobile,
  ItemMobileHeader,
  ItemMobileHeaderTitle,
  ItemMobileHeaderBadges,
  ItemMobileHeaderOptions,
  ItemDesktop,
  ItemDesktopCell,
} from "../../../../../../../components/personalized/Item";
// import { TextActions } from "./TextActions";
// import { deleteText, TextDTO } from "../_actions/text";
import { TextsDto } from "@/app/api/texts/route";
import { Badge } from "@/components/ui/badge";
import { TextActions } from "./TextActions";
import { deleteText } from "../_actions/text";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

function extractRawText(content: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const firstElement = doc.body.firstElementChild;

    if (firstElement) {
      // Verifica se o conteúdo contém uma quebra de linha <br>
      const brIndex = firstElement.innerHTML.indexOf("<br>");
      if (brIndex !== -1) {
        // Retorna o conteúdo até a quebra de linha, garantindo que a tag seja fechada
        const truncatedContent = firstElement.innerHTML.substring(0, brIndex);
        return `<${firstElement.tagName.toLowerCase()}>${truncatedContent}</${firstElement.tagName.toLowerCase()}>`;
      }

      // Se for uma lista <ul>, retorna apenas o conteúdo do primeiro <li> sem as tags <ul> e <li>
      if (firstElement.tagName.toLowerCase() === "ul") {
        const firstLi = firstElement.querySelector("li");
        if (firstLi) {
          return firstLi.innerHTML; // Retorna apenas o conteúdo interno do <li>
        }
      }

      // Retorna a primeira tag HTML normalmente
      return firstElement.outerHTML;
    }

    return "";
  } catch (error) {
    console.error("Erro ao processar o conteúdo:", error);
    return "";
  }
}

interface ExamItemProps {
  text: TextsDto;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile: boolean;
}

export function TextItem({
  text,
  isExpanded,
  onToggleExpand,
  isMobile,
}: ExamItemProps) {
  const [isPending, startTransition] = useTransition();
  const { id: idExam } = useParams<{ id: string }>();
  const { theme } = useTheme();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const data = await deleteText(text.id);
        if (data.error) {
          toast(data.error);
        } else if (data.success) {
          await queryClient.refetchQueries({
            queryKey: ["texts", idExam],
          });
          toast(data.success);
        }
      } catch {
        toast("Algo deu errado, informe o suporte!");
      }
    });
  };

  const rawText = extractRawText(text.content);

  if (isMobile) {
    return (
      <ItemMobile
        isPending={isPending}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      >
        <ItemMobileHeader>
          <div className="flex items-center space-x-4">
            <ItemMobileHeaderTitle name={"Texto " + text.number}>
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  `prose ${theme == "dark" && "prose-invert"} prose-purple`
                )}
                dangerouslySetInnerHTML={{ __html: rawText }}
              />
              <ItemMobileHeaderBadges>
                <Badge variant="secondary" className="text-xs">
                  Nº {text.number}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {text.questionCount} questões vinculadas
                </Badge>
              </ItemMobileHeaderBadges>
            </ItemMobileHeaderTitle>
          </div>
          <ItemMobileHeaderOptions>
            <TextActions
              text={text}
              idExam={idExam}
              handleDelete={handleDelete}
              isPending={isPending}
            />
          </ItemMobileHeaderOptions>
        </ItemMobileHeader>
      </ItemMobile>
    );
  }

  return (
    <ItemDesktop>
      <ItemDesktopCell isPending={isPending}>
        Texto {text.number}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {text.contentType}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <p
          className={cn(
            `prose ${theme == "dark" && "prose-invert"} prose-purple`
          )}
          dangerouslySetInnerHTML={{ __html: rawText }}
        />
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {text.reference && text.reference.length > 20
          ? text.reference?.substring(0, 20) + "..."
          : text.reference}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {text.questionCount}
      </ItemDesktopCell>

      <ItemDesktopCell isPending={isPending}>
        <TextActions
          text={text}
          idExam={idExam}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </ItemDesktopCell>
    </ItemDesktop>
  );
}
