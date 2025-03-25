"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import type { TestDTO } from "./TestsList";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TestItemProps {
  test: TestDTO;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile: boolean;
}

// Componentes personalizados para o card mobile
const ItemMobile = ({
  children,
}: {
  children: React.ReactNode;
  isExpanded?: boolean;
}) => <div className="w-full">{children}</div>;

const ItemMobileHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between items-start">{children}</div>
);

const ItemMobileHeaderTitle = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="flex flex-col">
    <h3 className="font-medium text-sm">{title}</h3>
    {children}
  </div>
);

const ItemMobileHeaderBadges = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex flex-wrap gap-2 mt-1">{children}</div>;

const ItemMobileHeaderOptions = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex items-center">{children}</div>;

const ItemMobileTrigger = ({
  isExpanded,
  onClick,
}: {
  isExpanded?: boolean;
  onClick?: () => void;
}) => (
  <button className="ml-2" onClick={onClick}>
    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>
);

const ItemMobileContent = ({
  children,
  isExpanded,
}: {
  children: React.ReactNode;
  isExpanded?: boolean;
}) => (
  <div className={`mt-3 ${isExpanded ? "block" : "hidden"}`}>{children}</div>
);

const ItemMobileContentData = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3 text-sm">{children}</div>
);

// Componente para células da tabela desktop
const ItemDesktopCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3">{children}</td>
);

export function TestItem({
  test,
  isExpanded,
  onToggleExpand,
  isMobile,
}: TestItemProps) {
  const getDisciplineName = (discipline: string) => {
    switch (discipline) {
      case "math":
        return "Matemática";
      case "language":
        return "Português";
      case "science":
        return "Ciências";
      case "history":
        return "História";
      case "geography":
        return "Geografia";
      default:
        return discipline;
    }
  };

  if (isMobile) {
    return (
      <ItemMobile isExpanded={isExpanded}>
        <ItemMobileHeader>
          <div>
            <ItemMobileHeaderTitle title={test.title}>
              <ItemMobileHeaderBadges>
                <Badge
                  variant={
                    test.status === "published" ? "default" : "destructive"
                  }
                >
                  {test.status === "published" ? "Publicado" : "Não publicado"}
                </Badge>
                <Badge variant="outline">
                  {getDisciplineName(test.discipline)}
                </Badge>
              </ItemMobileHeaderBadges>
            </ItemMobileHeaderTitle>
          </div>
          <ItemMobileHeaderOptions>
            <ItemMobileTrigger
              isExpanded={isExpanded}
              onClick={onToggleExpand}
            />
          </ItemMobileHeaderOptions>
        </ItemMobileHeader>
        <ItemMobileContent isExpanded={isExpanded}>
          <ItemMobileContentData>
            <span className="text-muted-foreground">Número:</span>
            <span>{test.id}</span>
            <span className="text-muted-foreground">Questões:</span>
            <span>{test.questions}</span>
            <span className="text-muted-foreground">Textos:</span>
            <span>{test.texts}</span>
            <span className="text-muted-foreground">Realizações:</span>
            <span>{test.completions}</span>
            <span className="text-muted-foreground">Data de criação:</span>
            <span>{test.createdAt}</span>
          </ItemMobileContentData>
        </ItemMobileContent>
      </ItemMobile>
    );
  }

  return (
    <>
      <ItemDesktopCell>{test.id}</ItemDesktopCell>
      <ItemDesktopCell>{test.title}</ItemDesktopCell>
      <ItemDesktopCell>
        <Badge variant="outline">{getDisciplineName(test.discipline)}</Badge>
      </ItemDesktopCell>
      <ItemDesktopCell>
        <Badge
          variant={test.status === "published" ? "default" : "destructive"}
        >
          {test.status === "published" ? "Publicado" : "Não publicado"}
        </Badge>
      </ItemDesktopCell>
      <ItemDesktopCell>{test.questions}</ItemDesktopCell>
      <ItemDesktopCell>{test.texts}</ItemDesktopCell>
      <ItemDesktopCell>{test.completions}</ItemDesktopCell>
    </>
  );
}
