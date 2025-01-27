"use client";

import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-curret-role";

export default function Home() {
  const router = useRouter();
  const role = useCurrentRole();

  useEffect(() => {
    if (role == "admin") return router.push("/admin/dashboard");
    if (role == "student") return router.push("/student/");

    notFound();
  }, [router]);

  return null;
}
