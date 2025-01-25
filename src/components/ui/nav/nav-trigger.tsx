"use client";

import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "../button";
import { useSidebar } from "../sidebar";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../breadcrumb";

export function NavTrigger() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  const showBackButton = pathname !== "/";

  const handleBack = () => {
    router.back();
  };

  const isUUID = (str: string) => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
  };

  return (
    <div className="flex w-full items-center justify-between space-x-4">
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="flex items-center px-3 py-2 text-sm font-medium"
        >
          <Menu className="mr-2 h-4 w-4" />
          Menu
        </Button>
        <Breadcrumb className="hidden md:flex items-center">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathnames.map((name, index) => {
              if (isUUID(name)) return null;
              if (name === "admin") return null;

              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              return (
                <BreadcrumbItem key={routeTo}>
                  {isLast ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink asChild>
                        <Link href={routeTo}>{name}</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {showBackButton && (
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="flex items-center text-sm"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>
      )}
    </div>
  );
}
