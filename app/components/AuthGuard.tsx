"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("redirect");
      router.replace("/login");
    } else {
      setStatus("ok");
    }
  }, [router]);

  // 검사 중 → 아무것도 안 보여줌 (깜빡임 방지)
  if (status === "loading") return null;

  // 리다이렉트 중 → 아무것도 안 보여줌
  if (status === "redirect") return null;

  // 로그인 확인 완료 → 정상 렌더링
  return <>{children}</>;
}