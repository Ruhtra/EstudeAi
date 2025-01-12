"use client"

import { useState } from "react";
import { useActionState } from "react";
import { produceNewMessage } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboboxCreate } from "@/components/comboboxCreate";

export function UseActionStateExample() {
    const [comboboxValue, setComboboxValue] = useState("");
    let [[data, err], submitAction, isPending] = useActionState(
        produceNewMessage,
        [null, null]
    );


    return (
        <>
            <form action={submitAction} className="flex flex-col gap-4">
                <Input name="name" placeholder="Enter your name..." />
                <Input type="hidden" name="discipline" value={comboboxValue} />
                {err && <div>Error: {err?.fieldErrors?.name}</div>}
                <ComboboxCreate 
                    options={["ablebl", 'ablbl']} 
                    emptyMessage="empty" 
                    value={comboboxValue} 
                    onSetValue={setComboboxValue} 
                    placeholder={"seleciona algo"} 
                    searchPlaceholder={"pesquise"} 
                    />
                {err && <div>Error: {err?.fieldErrors?.discipline}</div>}
                <Button disabled={isPending}>Create message</Button>
            </form>

            {isPending && <div>Loading...</div>}
            {data && <p>Message: {data}</p>}
        </>
    );
}