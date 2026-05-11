"use client";
import { useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

const NAV_TABS = ["구매내역", "찜한 상품", "포인트", "나의 리뷰", "계정 설정"];
const WISH_TABS = ["내가 찜한 상품", "나중에 구매할 상품"];

function WishContent() {
  const [activeWishTab, setActiveWishTab] = useState(0);

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .my-tab { font-size: 14px; color: #888; cursor: pointer; padding-bottom: 12px; border-bottom: 2px solid transparent; transition: all 0.15s; text-decoration: none; white-space: nowrap; }
        .my-tab:hover { color: #111; }
        .my-tab.active { color: #111; font-weight: 700; border-bottom-color: #111; }
        .wish-tab { flex: 1; text-align: center; padding: 14px 0; font-size: 14px; font-weight: 500; color: #aaa; cursor: pointer; border-bottom: 2px solid #eee; transition: all 0.15s; }
        .wish-tab.active { color: #111; font-weight: 700; border-bottom-color: #111; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 80px" }}>

        <Link href="/my-page" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px", cursor: "pointer", color: "#111" }}>마이페이지</h1>
        </Link>

        {/* 상단 탭 */}
        <div style={{ display: "flex", gap: 24, marginBottom: 40, borderBottom: "1px solid #eee" }}>
          {NAV_TABS.map((tab, i) => (
            <Link key={tab}
              href={i === 1 ? "/wish" : "#"}
              className={`my-tab${i === 1 ? " active" : ""}`}
              style={{ paddingBottom: 12, textDecoration: "none" }}>
              {tab}{tab === "계정 설정" && <span style={{ fontSize: 11, marginLeft: 4 }}>↗</span>}
            </Link>
          ))}
        </div>

        {/* 찜/나중에 서브탭 */}
        <div style={{ display: "flex", marginBottom: 48 }}>
          {WISH_TABS.map((tab, i) => (
            <div key={tab} className={`wish-tab${activeWishTab === i ? " active" : ""}`}
              onClick={() => setActiveWishTab(i)}>
              {tab}
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          {activeWishTab === 0 ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 20 }}>🤍</div>
              <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>찜한 상품이 없습니다.</p>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>마음에 드는 상품을 찜해보세요!</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 20 }}>🛍️</div>
              <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>나중에 구매할 상품이 없습니다.</p>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>나중에 구매할 상품을 원하는 시간에 쉽게 찾아보세요.</p>
            </>
          )}
          <Link href="/" style={{ display: "inline-block", background: "#111", color: "#fff", borderRadius: 8, padding: "12px 32px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            쇼핑 계속하기
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function WishPage() {
  return (
    <AuthGuard>
      <WishContent />
    </AuthGuard>
  );
}