"use client";
import { useState } from "react";
import Link from "next/link";

const NAV_TABS = ["구매내역", "찜한 상품", "포인트", "나의 리뷰", "계정 설정"];

const WISH_TABS = ["내가 찜한 상품", "나중에 구매할 상품"];

export default function WishPage() {
  const [activeWishTab, setActiveWishTab] = useState(0);

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .search-input { width: 100%; border: none; outline: none; font-size: 13px; background: transparent; font-family: inherit; color: #333; }
        .search-input::placeholder { color: #aaa; }
        .my-tab { font-size: 14px; color: #888; cursor: pointer; padding-bottom: 12px; border-bottom: 2px solid transparent; transition: all 0.15s; text-decoration: none; white-space: nowrap; }
        .my-tab:hover { color: #111; }
        .my-tab.active { color: #111; font-weight: 700; border-bottom-color: #111; }
        .wish-tab { flex: 1; text-align: center; padding: 14px 0; font-size: 14px; font-weight: 500; color: #aaa; cursor: pointer; border-bottom: 2px solid #eee; transition: all 0.15s; }
        .wish-tab.active { color: #111; font-weight: 700; border-bottom-color: #111; }
      `}</style>

      {/* ── 네비 ── */}
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>안보EASY</span>
            <span style={{ width: 1, height: 11, background: "#ddd" }} />
            <span style={{ fontSize: 11, color: "#888" }}>Adversarial Clothing Web</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#555", cursor: "pointer" }}>KR ▾</span>
            <Link href="/login"  style={{ fontSize: 11, color: "#555", textDecoration: "none" }}>로그인</Link>
            <Link href="/signup" style={{ fontSize: 11, color: "#555", textDecoration: "none" }}>회원가입</Link>
          </div>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-1px", color: "#111" }}>
              <span style={{ color: "#e8541e" }}>A</span>CW
            </span>
          </Link>
          <div style={{ width: 320, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", height: 36, gap: 8 }}>
            <svg width="14" height="14" fill="none" stroke="#999" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="search-input" placeholder="검색어를 입력하세요" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
            <Link href="/wish">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer", display: "block" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </Link>
            <Link href="/cart">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer", display: "block" }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
            <Link href="/my-page">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer", display: "block" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 80px" }}>

        <Link href="/my-page" style={{ textDecoration: "none', color: 'inherit" }}>
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