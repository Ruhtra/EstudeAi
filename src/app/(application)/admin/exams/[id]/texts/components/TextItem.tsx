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

function extractRawText(content: string): string {
  // Extrai o conteúdo da primeira tag <p>
  const match = content.match(/<p>(.*?)<\/p>/);
  if (match && match[1]) {
    const rawText = match[1].trim(); // Texto cru da primeira tag <p>
    return rawText.length > 50 ? rawText.substring(0, 50) + "..." : rawText;
  }

  // Caso não haja tags <p>, remove outras tags HTML e corta os primeiros 50 caracteres
  const rawText = content.replace(/<[^>]+>/g, "");
  return rawText.length > 50 ? rawText.substring(0, 50) + "..." : rawText;
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
              <p className="text-sm text-muted-foreground">{rawText}</p>
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
      <ItemDesktopCell isPending={isPending}>{rawText}</ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {text.reference.length > 20
          ? text.reference.substring(0, 20) + "..."
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
