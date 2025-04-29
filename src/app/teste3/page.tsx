"use client";

import { GenericTable } from "./_components/Content/Ui/GenericTable";
import { UserProvider } from "./_components/UserMutationProvider";

const mockData = [
  { id: "1", name: "João" },
  { id: "2", name: "Maria" },
];

const ExamplePage = () => {
  return (
    <UserProvider>
      <Comp />
    </UserProvider>
  );
};

const Comp = () => {
  return (
    <>
      <GenericTable data={mockData} />
    </>
  );
};

export default ExamplePage;
