
'use client';

import { GenericTable } from "./_components/Content/Ui/GenericTable";
// import ShowStatus from "./_components/Content/Ui/ShowStatus";
import { UserProvider, useUserContext } from "./_components/UserMutationProvider";


const mockData = [
    { id: "1", name: "João" },
    { id: "2", name: "Maria" }
];

const ExamplePage = () => {
    
    return (
        <UserProvider>
            <Comp />
        </UserProvider>
    );
};

const Comp = () => {
    const userContext = useUserContext()
    return (
        <>
            {/* <ShowStatus /> */}
            <GenericTable data={mockData} />
        </>

    );
};

export default ExamplePage;
