'use client';

import { Button } from '@/components/ui/button';
import { Content } from './_components/Content';
import { Header } from './_components/Header';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

// Simulação de dados
const fakeUsers = [
  { id: 1, nome: 'João', telefone: '1234', endereco: 'Rua A' },
  { id: 2, nome: 'Maria', telefone: '5678', endereco: 'Rua B' },
];

export default function UsersPage() {
  const { data: users = fakeUsers } = useQuery({
    queryKey: ['user'],
    queryFn: async () => fakeUsers
  });

  const isMobile = true;

  return (
    <>
      <Header.Root>
        <Header.Title>Usuários</Header.Title>
        <Header.Content >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <Button onClick={() => { }}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
            </Button>
          </div>
        </Header.Content>
      </Header.Root>

      <Content.Root>
        <Content.Layout isMobile={isMobile}>
          {isMobile ? (
            users.map((user) => (
              <Content.Item.Mobile
                key={user.id}
                expandable
                header={<span>{user.nome}</span>}
              >
                <div>Telefone: {user.telefone}</div>
                <div>Endereço: {user.endereco}</div>
                <Content.Actions>
                  <Content.ActionsEdit />
                  <Content.ActionsPublish />
                </Content.Actions>
              </Content.Item.Mobile>
            ))
          ) : (
            <>
              <Content.Table.Root>
                <Content.Table.Header headers={['Nome', 'Telefone', 'Endereço', 'Ações']} />
                <Content.Table.Body>
                  {users.map((user) => (
                    <Content.Item.Desktop
                      key={user.id}
                      cells={[
                        <span>{user.nome}</span>,
                        <span>{user.telefone}</span>,
                        <span>{user.endereco}</span>,
                        <Content.Actions>
                          <Content.ActionsEdit />
                          <Content.ActionsPublish />
                        </Content.Actions>,
                      ]}
                    />
                  ))}
                </Content.Table.Body>
              </Content.Table.Root>
            </>
          )}
        </Content.Layout>
      </Content.Root>
    </>
  );
}
