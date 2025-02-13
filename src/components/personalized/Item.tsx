"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const ItemMobile = ({
  isExpanded,
  isPending,
  onToggleExpand,
  children,
}: {
  isExpanded?: boolean;
  isPending: boolean;
  onToggleExpand?: () => void;
  children: ReactNode;
}) => {
  const itemClasses = cn(
    "transition-opacity duration-200",
    isPending && "opacity-50 pointer-events-none"
  );
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <div className={itemClasses}>{children}</div>
    </Collapsible>
  );
};

export const ItemDesktop = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const ItemDesktopCell = ({
  isPending,
  children,
}: {
  isPending: boolean;
  children: ReactNode;
}) => {
  const itemClasses = cn(
    "transition-opacity duration-200",
    isPending && "opacity-50 pointer-events-none"
  );
  return (
    <>
      <TableCell className={itemClasses}>{children}</TableCell>
    </>
  );
};

export const ItemMobileTrigger = ({
  isPending,
  isExpanded,
}: {
  isPending: boolean;
  isExpanded?: boolean;
}) => {
  return (
    <CollapsibleTrigger asChild>
      <Button variant="ghost" size="sm" disabled={isPending}>
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
        />
      </Button>
    </CollapsibleTrigger>
  );
};
export const ItemMobileHeader = ({ children }: { children: ReactNode }) => {
  return <div className="flex bg items-start justify-between">{children}</div>;
};
export const ItemMobileHeaderOptions = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div className="flex">{children}</div>;
};
export const ItemMobileHeaderBadges = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div className="flex flex-wrap gap-2">{children}</div>;
};
export const ItemMobileHeaderTitle = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <div className="space-y-1">
      <h3 className="font-medium">{name}</h3>
      {children}
    </div>
  );
};

export const ItemMobileContent = ({ children }: { children: ReactNode }) => {
  return (
    <CollapsibleContent className="space-y-4">{children}</CollapsibleContent>
  );
};

export const ItemMobileContentData = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="mt-4 space-y-2">
      <div className="grid grid-cols-2 gap-2 text-sm">{children}</div>
    </div>
  );
};
export const ItemMobileContentOptions = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div className="flex flex-wrap gap-2">{children}</div>;
};
