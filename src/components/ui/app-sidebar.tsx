"use client";

import type * as React from "react";
import { Calendar, FileText, HelpCircle, Home, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav/nav-user";
import { NavMain, type NavMainProps } from "./nav/nav-main";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const user = useCurrentUser();

  const data: {
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    navMain: NavMainProps[];
  } = {
    user: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.image || "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
        isActive: pathname === "/admin/dashboard",
      },
      {
        title: `Provas ${
          pathname.includes("/admin/exams/")
            ? `(${pathname.split("/").pop()})`
            : ""
        }`,
        url: "/admin/exams",
        icon: Calendar,
        isActive: pathname.includes("/admin/exams"),
        items: pathname.includes("/admin/exams/")
          ? [
              {
                title: "Textos",
                url: `/admin/exams/${pathname.split("/")[3]}/texts`,
                isActive: pathname.endsWith("/texts"),
                icon: FileText,
              },
              {
                title: "Questões",
                url: `/admin/exams/${pathname.split("/")[3]}/questions`,
                isActive: pathname.endsWith("/questions"),
                icon: HelpCircle,
              },
            ]
          : undefined,
      },
      {
        title: "Usuários",
        url: "/admin/users",
        icon: Users,
        isActive: pathname === "/admin/users",
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center overflow-hidden rounded-lg">
                  <Image
                    // width={undefined}
                    fill={true}
                    src="/images/LOGOMARCA.jpg"
                    className="h-full w-full object-contain bg-secondary"
                    alt="EstudeiAi Logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-base font-semibold">
                    EstudeAi App
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Sistema de Gestão
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
