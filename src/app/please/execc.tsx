"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useServerAction } from "zsa-react"
import { produceNewMessage } from "./actions"
import { useActionState } from "react"

export const ExecuteFormAction = () => {
    let [[data, err], submitAction, isPending] =
    useActionState(produceNewMessage, [null, null]) 

  return (
    <>
    
    INFERNO</>
    // <Card className="">
    //   <CardHeader>
    //     <CardTitle>Form Example</CardTitle>
    //   </CardHeader>
    //   <CardContent className="flex flex-col gap-4">
    //     buceeeeeeeeeeta
    //     <form className="flex flex-col gap-4" action={submitAction}>
    //       <Input type="text" name="name" placeholder="Enter your name..." />
    //       <Button className="w-full" type="submit" disabled={isPending}>
    //         Submit
    //       </Button>
    //       {isPending && <div>Loading...</div>}
    //     </form>
    //   </CardContent>
    // </Card>
  )
}