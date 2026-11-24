"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Level3RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/intro_level3");
  }, [router]);

  return null;
}

