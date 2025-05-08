"use client";

import { Button } from "@/components/ui/button";
import { Content } from "./_components/Content";
import { Header } from "./_components/Header";
import { Plus } from "lucide-react";
import { CreateUserDialog } from "../(application)/admin/users/_components/CreateUserDialog";
import { createContext, useContext, useState } from "react";
import {
  UserItemProvider,
  UserProvider,
  useUserContext,
  useUserItemContext,
} from "./UserMutationProvider";
import { UserDto } from "./UserMutationProvider";
import { UseMutationResult } from "@tanstack/react-query";
import { createGenericItemContext } from "./_components/GenericMutationContext";
import { ContentItemContext } from "./_components/ComponentContext";

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <UserProvider>
        <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        <Header.Root>
          <Header.Title>Usuários</Header.Title>
          <Header.Content>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
              </Button>
            </div>
          </Header.Content>
        </Header.Root>
        <PageContent />
      </UserProvider>
    </>
  );
}

function PageContent() {
  const userContext = useUserContext();
  // const {isPending, mutate} = userContext.useDeleteMultipleMutation()
  const isMobile = false;

  return (
    <Content.Root context={userContext}>
      <Content.Layout isMobile={isMobile}>
        {isMobile ? (
          userContext.useFetchQuery.data?.map((user) => (
            <Item key={"m" + user.id} isMobile={isMobile} user={user} />
          ))
        ) : (
          <Content.Table.Root>
            <Content.Table.Header>
              <Content.Table.Row>
                <Content.Table.Head>
                  Nome
                  {/* <Button disabled={isPending} onClick={() => {
                    mutate()
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Deletaar vários usuários
                  </Button> */}
                </Content.Table.Head>
                <Content.Table.Head>Email</Content.Table.Head>
                <Content.Table.Head className="w-[60px]">
                  Ações
                </Content.Table.Head>
              </Content.Table.Row>
            </Content.Table.Header>
            <Content.Table.Body>
              {userContext.useFetchQuery.data?.map((user) => (
                <Item key={"d" + user.id} isMobile={isMobile} user={user} />
              ))}
            </Content.Table.Body>
          </Content.Table.Root>
        )}
      </Content.Layout>
    </Content.Root>
  );
}

function Item({ isMobile, user }: { isMobile: boolean; user: UserDto }) {
  const { useDeleteMutation } = useUserContext();

  return (
    <>
      <UserItemProvider id={user.id} useDeleteMutation={useDeleteMutation}>
        <ItemSubGroup isMobile={isMobile} user={user} />
      </UserItemProvider>
    </>
  );
}

function ItemSubGroup({
  isMobile,
  user,
}: {
  isMobile: boolean;
  user: UserDto;
}) {
  const userItemContext = useUserItemContext();

  return (
    <ContentItemContext.Provider value={userItemContext}>
      {isMobile ? (
        <Content.Card.ItemMobile key={user.id} expandable={false}>
          <Content.Card.ItemMobileHeader>
            <div>
              <Content.Card.ItemMobileHeaderTitle title={user.name} />
            </div>
            <Content.Card.ItemMobileHeaderOptions>
              <Content.Actions.Root>
                <Content.Actions.Delete />
              </Content.Actions.Root>
            </Content.Card.ItemMobileHeaderOptions>
          </Content.Card.ItemMobileHeader>
          <Content.Card.ItemMobileContent>
            <Content.Card.ItemMobileContentData>
              <span className="text-muted-foreground">Email:</span>
              {user.email}
            </Content.Card.ItemMobileContentData>
          </Content.Card.ItemMobileContent>
        </Content.Card.ItemMobile>
      ) : (
        <Content.Table.Row key={user.id}>
          <Content.Table.Cell>
            <span>{user.name}</span>
          </Content.Table.Cell>
          <Content.Table.Cell>
            <span>{user.email}</span>
          </Content.Table.Cell>
          <Content.Table.Cell>
            <Content.Actions.Root>
              <Content.Actions.Delete />
            </Content.Actions.Root>
          </Content.Table.Cell>
        </Content.Table.Row>
      )}
    </ContentItemContext.Provider>
  );
}
