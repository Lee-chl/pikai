"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminToast() {
  const router = useRouter();

  useEffect(() => {
    toast.error("관리자만 진입할 수 있습니다.");
    router.replace("/");
  }, [router]);

  return null;
}
