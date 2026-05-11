"use client";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

function CartContent() {
  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .step-item { display: flex; align-items: center; gap: 6px; font-size: 13px; }
        .step-item.active   { font-weight: 700; color: #111; }
        .step-item.inactive { color: #bbb; }
      `}</style>

      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "40px 48px 80px", width: "100%" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, letterSpacing: "-0.5px" }}>장바구니</h1>

        {/* 스텝 브레드크럼 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}>
          <span className="step-item active">장바구니</span>
          <span style={{ color: "#ccc", fontSize: 13 }}>›</span>
          <span className="step-item inactive">주문서 작성</span>
          <span style={{ color: "#ccc", fontSize: 13 }}>›</span>
          <span className="step-item inactive">주문 완료</span>
        </div>

        {/* 빈 상태 */}
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>장바구니에 담은 상품이 없어요.</p>
          <p style={{ fontSize: 14, color: "#888" }}>비어있는 장바구니를 채워주세요!</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 28, background: "#111", color: "#fff", borderRadius: 8, padding: "12px 32px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}