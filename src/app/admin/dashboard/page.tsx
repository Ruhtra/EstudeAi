"use client";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/data/mail";
import React from "react";
import { CreateUserDialog } from "../users/_components/CreateUserDialog";

export default function DashboardPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>

      <CreateUserDialog idUser="cm6h52veu0000iot890kxdqye">
        <Button>criar</Button>
      </CreateUserDialog>

      <Button
        onClick={() => {
          sendVerificationEmail("kawanarthurskate@gmail.com", "123")
            .then(() => {
              console.log("ok");
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        click to send email
      </Button>
    </div>
  );
}
