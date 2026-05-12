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
    console.log("AuthGuard 실행됨 - token:", token);
    if (!token) {
      console.log("token 없음 - 로그인 페이지로 이동");
      setStatus("redirect");
      router.replace("/login");
    } else {
      console.log("token 있음 - 정상 렌더링");
      setStatus("ok");
    }
  }, [router]);

  if (status === "loading") return null;
  if (status === "redirect") return null;

  return <>{children}</>;
}
