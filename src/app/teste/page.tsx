"use client";

// import { Header } from './_components/Header';
// import { Content } from './_components/Content';
// import { useQuery } from '@tanstack/react-query';

// // Simulação de dados
// const fakeUsers = [
//   { id: 1, nome: 'João', telefone: '1234', endereco: 'Rua A' },
//   { id: 2, nome: 'Maria', telefone: '5678', endereco: 'Rua B' },
// ];

export default function UsersPage() {
  // Substitua por sua Transpac/React Query: exemplo simplificado
  // const { data: users = fakeUsers } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: async () => fakeUsers
  // });
  // // Você pode trocar esta variável por um hook que detecte o tamanho da tela
  // const isMobile = true; // ou true para simular mobile
  // return (
  //   <>
  //     <Header.Root>
  //       <Header.Title>Usuários</Header.Title>
  //       <Header.BackButton show />
  //     </Header.Root>
  //     <Content.Root>
  //       <Content.Layout isMobile={isMobile}>
  //         {isMobile ? (
  //           // Visualização mobile (cards) com toggle de expansão
  //           users.map((user) => (
  //             <Content.Item.Mobile
  //               key={user.id}
  //               expandable
  //               header={<span>{user.nome}</span>}
  //             >
  //               <div>Telefone: {user.telefone}</div>
  //               <div>Endereço: {user.endereco}</div>
  //               <Content.Actions>
  //                 <Content.ActionsEdit />
  //                 <Content.ActionsPublish />
  //               </Content.Actions>
  //             </Content.Item.Mobile>
  //           ))
  //         ) : (
  //           // Visualização desktop (tabela com padrão shadcn)
  //           <>
  //             <Content.Table.Root>
  //               <Content.Table.Header headers={['Nome', 'Telefone', 'Endereço', 'Ações']} />
  //               <Content.Table.Body>
  //                 {users.map((user) => (
  //                   <Content.Item.Desktop
  //                     key={user.id}
  //                     cells={[
  //                       <span>{user.nome}</span>,
  //                       <span>{user.telefone}</span>,
  //                       <span>{user.endereco}</span>,
  //                       <Content.Actions>
  //                         <Content.ActionsEdit />
  //                         <Content.ActionsPublish />
  //                       </Content.Actions>,
  //                     ]}
  //                   />
  //                 ))}
  //               </Content.Table.Body>
  //             </Content.Table.Root>
  //           </>
  //         )}
  //       </Content.Layout>
  //     </Content.Root>
  //   </>
  // );
}
