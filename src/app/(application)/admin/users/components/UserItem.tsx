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
  ItemMobileContent,
  ItemMobileContentData,
  ItemMobileTrigger,
  ItemDesktop,
  ItemDesktopCell,
} from "../../../../../components/personalized/Item";
import { UserActions } from "./UserActions";
import { deleteUser, UserDTO } from "../_actions/user";
import Image from "next/image";
import { UserRole } from "@prisma/client";

interface ExamItemProps {
  user: UserDTO;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile: boolean;
}

export function UserItem({
  user,
  isExpanded,
  onToggleExpand,
  isMobile,
}: ExamItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const data = await deleteUser(user.id);
        if (data.error) {
          toast(data.error);
        } else if (data.success) {
          await queryClient.refetchQueries({
            queryKey: ["users"],
          });
          toast(data.success);
        }
      } catch {
        toast("Algo deu errado, informe o suporte!");
      }
    });
  };

  if (isMobile) {
    return (
      <ItemMobile
        isPending={isPending}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      >
        <ItemMobileHeader>
          <div className="flex items-center space-x-4">
            {user.imageUrl ? (
              <Image
                width={48}
                height={48}
                src={user.imageUrl || "/placeholder.svg"}
                alt={`Foto de ${user.name}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}{" "}
            <ItemMobileHeaderTitle name={user.name}>
              <ItemMobileHeaderBadges>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </ItemMobileHeaderBadges>
            </ItemMobileHeaderTitle>
          </div>
          <ItemMobileHeaderOptions>
            <UserActions
              user={user}
              handleDelete={handleDelete}
              isPending={isPending}
            />
            <ItemMobileTrigger isPending={isPending} isExpanded={isExpanded} />
          </ItemMobileHeaderOptions>
        </ItemMobileHeader>
        <ItemMobileContent>
          <ItemMobileContentData>
            <span className="text-muted-foreground">Email:</span>
            <span>{user.email}</span>
            <span className="text-muted-foreground">Telefone:</span>
            <span>
              {user.phone.replace(
                /(\d{2})(\d{1})(\d{4})(\d{4})/,
                "($1) $2 $3-$4"
              )}
            </span>
            <span className="text-muted-foreground">Cpf:</span>
            <span>
              {user.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
            </span>
          </ItemMobileContentData>
        </ItemMobileContent>
      </ItemMobile>
    );
  }

  return (
    <ItemDesktop>
      <ItemDesktopCell isPending={isPending}>
        {user.imageUrl ? (
          <Image
            src={user.imageUrl || "/placeholder.svg"}
            alt={`Foto de ${user.name}`}
            className="w-10 h-10 rounded-full object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>{user.name}</ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>{user.email}</ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {UserRole[user.role]}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {user.phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {user.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
      </ItemDesktopCell>

      <ItemDesktopCell isPending={isPending}>
        <UserActions
          user={user}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </ItemDesktopCell>
    </ItemDesktop>
  );
}
