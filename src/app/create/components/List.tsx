import { use } from "react";
import { getAllContacts } from "./actions";
import { Cc } from "./Aaa";
import { ContactForm } from "./contact-form";

export function List() {
  const data = use(getAllContacts());

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div>
        <div className="flex flex-col w-full  gap-1">
          {data &&
            data.map(async (e) => {
              return <Cc key={e.id} id={e.id} email={e.email} />;
            })}
        </div>
        <br />

        <ContactForm />
      </div>
    </div>
  );
}
