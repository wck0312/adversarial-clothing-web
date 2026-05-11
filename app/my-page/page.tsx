"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

const NAV_TABS = ["구매내역", "찜한 상품", "포인트", "나의 리뷰", "계정 설정"];

const ORDER_STEPS = [
  { label: "결제 확인",    desc: "주문이 접수되었습니다.\n결제 확인 후 다음단계로 진행됩니다." },
  { label: "제작 준비중",  desc: "주문하신 커스텀 사양을 확인하고,\n제작을 준비하고 있습니다." },
  { label: "제작중",       desc: "주문하신 커스텀 상품을\n제작하고 있습니다." },
  { label: "배송 준비중",  desc: "상품 배송을 준비하고 있습니다." },
  { label: "배송중",       desc: "물품이 발송되어\n고객님께 배송중입니다." },
  { label: "배송 완료",    desc: "배송이 완료되었습니다.\n배송 완료일 포함 7일 이내\n교환/반품신청이 가능합니다." },
];

function MyPageContent() {
  const [userName, setUserName] = useState("사용자");

  // localStorage에서 user 정보 읽기
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        // 백엔드 응답 키에 맞게 수정하세요 (name / username / nickname 등)
        setUserName(user.name ?? user.username ?? user.nickname ?? "사용자");
      }
    } catch {
      setUserName("사용자");
    }
  }, []);

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .my-tab { font-size: 14px; color: #888; cursor: pointer; padding-bottom: 2px; border-bottom: 2px solid transparent; transition: all 0.15s; text-decoration: none; }
        .my-tab:hover { color: #111; }
        .my-tab.active { color: #111; font-weight: 700; border-bottom-color: #111; }
        .order-col { text-align: center; flex: 1; }
        .order-num { font-size: 28px; font-weight: 800; color: #aaa; margin-bottom: 6px; }
        .order-label { font-size: 13px; font-weight: 600; color: #ddd; margin-bottom: 8px; }
        .order-desc { font-size: 11px; color: #666; line-height: 1.6; white-space: pre-line; }
      `}</style>

      {/* ── 본문 (네비는 layout.tsx의 TopNav가 담당) ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 80px" }}>

        <Link href="/my-page" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px", cursor: "pointer", color: "#111" }}>마이페이지</h1>
        </Link>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32, borderBottom: "1px solid #eee" }}>
          {NAV_TABS.map((tab, i) => (
            <Link
              key={tab}
              href={i === 1 ? "/wish" : "#"}
              className="my-tab"
              style={{ paddingBottom: 12, textDecoration: "none" }}
            >
              {tab}{tab === "계정 설정" && <span style={{ fontSize: 11, marginLeft: 4 }}>↗</span>}
            </Link>
          ))}
        </div>

        {/* 유저 요약 카드 — 실제 이름 표시 */}
        <div style={{ background: "#111", borderRadius: 16, padding: "32px 40px", display: "flex", alignItems: "center", gap: 0, marginBottom: 48 }}>
          <div style={{ flex: 2 }}>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 6, cursor: "pointer" }}>개인정보 변경</p>
            {/* ↓ 여기가 핵심: 고정 텍스트 → 실제 userName 표시 */}
            <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              {userName} 님,<br />반가워요 👋
            </p>
          </div>
          <div style={{ width: 1, height: 60, background: "#333", margin: "0 32px" }} />
          {[
            { label: "리뷰", value: "0 / 0 개" },
            { label: "장바구니", value: "0 개" },
            { label: "찜한 상품", value: "0 개" },
            { label: "포인트", value: "0 P" },
          ].map((item) => (
            <div key={item.label} style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>{item.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* 최근 구매내역 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}>최근 1개월 구매내역</h2>
          <span style={{ fontSize: 13, color: "#555", cursor: "pointer" }}>전체보기</span>
        </div>

        {/* 주문 단계 */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid #eee", paddingBottom: 28 }}>
          {ORDER_STEPS.map((step) => (
            <div key={step.label} className="order-col">
              <div className="order-num">0</div>
              <div className="order-label">{step.label}</div>
              <div className="order-desc">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* 구매내역 테이블 헤더 */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 20 }}>
          {["주문일자 / 주문번호", "구매 상품정보", "도안", "금액", "진행상태"].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{h}</span>
          ))}
        </div>

        {/* 빈 상태 */}
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa", fontSize: 14 }}>
          최근 1개월 내 구매내역이 없습니다.
        </div>
      </div>
    </div>
  );
}

// AuthGuard로 감싸서 export — 비로그인이면 /login으로 리다이렉트
export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  );
}