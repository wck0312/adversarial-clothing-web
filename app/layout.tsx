import type { Metadata } from "next";
import TopNav from "./components/TopNav";

export const metadata: Metadata = {
  title: "ACW - Adversarial Clothing Web",
  description: "나만의 커스텀 의류를 만들어보세요",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif" }}>
        {/*
          TopNav는 "use client" 컴포넌트라서 여기서 import해도 괜찮아요.
          pathname을 보고 /login, /signup 페이지에서는 자동으로 숨겨집니다.
        */}
        <TopNav />
        {children}
      </body>
    </html>
  );
}