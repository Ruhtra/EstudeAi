"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface NavMainProps {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavMainProps[];
}

export function Collapsiblee({ item }: { item: NavMainProps }) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const handleLinkClick = useCallback(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [toggleSidebar, isMobile]);

  return (
    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={pathname.includes(item.url)}
        >
          <Link
            href={item.url}
            onClick={handleLinkClick}
            className="flex items-center text-sm"
          >
            {item.icon ? (
              <item.icon className="mr-2 h-4 w-4" />
            ) : (
              <span className="mr-2 h-1 w-1 rounded-full bg-current" />
            )}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
        {item.items?.length ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="transition-transform data-[state=open]:rotate-90">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Expandir</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <Collapsiblee key={subItem.title} item={subItem} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: NavMainProps[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium">
        Menu Principal
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsiblee key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
