"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ───── 데이터 ───── */
const MEGA_MENU = {
  "의류": ["티셔츠", "셔츠", "맨투맨", "후드", "집업", "아우터", "바지"],
  "패션잡화": ["가방", "파우치", "모자", "신발/슬리퍼", "양말/장갑", "주얼리/네일", "타투스티커", "스카프/머플러", "지갑/케이스", "마스크"],
};

const NAV_ITEMS = ["전체 상품", "의류", "패션잡화"];

const HERO_CARDS = [
  {
    title: "나만의 스타일을\n거리에 새기다",
    sub: "그래피티 아트 커스텀 티셔츠",
    bg: "#0a0a0a",
    dark: true,
    imgLeft: "/hero-graffiti1.png",
    imgRight: "/hero-graffiti2.png",
    titleColor: "#FF6B1A",
    subColor: "rgba(255,255,255,0.6)",
  },
  {
    title: "평범함을 거부하는\n당신을 위한 디자인",
    sub: "강렬한 컬러로 나를 표현하세요",
    bg: "#1a0a2e",
    dark: true,
    imgLeft: "/hero-popart.png",
    imgRight: "/hero-tiger.png",
    titleColor: "#FF69B4",
    subColor: "rgba(255,255,255,0.6)",
  },
  {
    title: "디지털 감성을\n입다",
    sub: "글리치 아트로 완성된 나만의 한 장",
    bg: "#111111",
    dark: true,
    imgLeft: "/hero-glitch.png",
    imgRight: null,
    titleColor: "#00FFFF",
    subColor: "rgba(255,255,255,0.6)",
  },
];

/* ───── 메인 컴포넌트 ───── */
export default function Home() {
  const [megaOpen, setMegaOpen]   = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const megaRef = useRef<HTMLDivElement>(null);

  // 메가메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-cat {
          font-size: 13.5px; font-weight: 500; color: #111; cursor: pointer;
          padding: 0 10px; white-space: nowrap; line-height: 46px;
          border-bottom: 2px solid transparent; transition: border-color 0.15s;
        }
        .nav-cat:hover { border-bottom-color: #111; }
        .nav-cat.right { color: #555; }

        .mega-col h4 { font-size: 13px; font-weight: 700; margin-bottom: 10px; cursor: pointer; }
        .mega-col h4:hover { text-decoration: underline; }
        .mega-item { font-size: 12.5px; color: #444; cursor: pointer; line-height: 1.9; display: block; }
        .mega-item:hover { color: #e8541e; text-decoration: underline; }

        .hero-card { border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
        .hero-card:hover { transform: scale(1.01); }

        .search-input { width: 100%; border: none; outline: none; font-size: 14px; background: transparent; font-family: inherit; color: #333; }
        .search-input::placeholder { color: #aaa; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .mega-dropdown { animation: fadeIn 0.18s ease; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "-0.3px" }}>안보EASY</span>
            <span style={{ width: 1, height: 12, background: "#ddd" }} />
            <span style={{ fontSize: 12, color: "#888", letterSpacing: "0.2px" }}>Adversarial Clothing Web</span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>KR ▾</span>
            <Link href="/login" style={{ fontSize: 12, color: "#555", textDecoration: "none", cursor: "pointer" }}>로그인</Link>
            <Link href="/signup" style={{ fontSize: 12, color: "#555", textDecoration: "none", cursor: "pointer" }}>회원가입</Link>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <div style={{ borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 40, background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", gap: 16, height: 60 }}>
          {/* 로고 */}
          <div style={{ cursor: "pointer", flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px" }}>
              <span style={{ color: "#e8541e" }}>A</span>CW
            </span>
          </div>

          {/* 검색바 */}
          <div style={{ width: 360, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", height: 40, gap: 8, flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" stroke="#999" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              placeholder="검색어를 입력하세요"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>

          {/* 우측 아이콘 */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: "auto" }}>
            <Link href="/wish" style={{ display: "flex" }}>
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>
            <Link href="/cart" style={{ display: "flex" }}>
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>
            <Link href="/my-page" style={{ display: "flex" }}>
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* ── 카테고리 네비 + 메가 드롭다운 ── */}
        <div ref={megaRef} style={{ borderTop: "1px solid #f0f0f0", position: "relative" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", overflowX: "auto" }}>
              {/* 전체 상품 (메가메뉴 토글) */}
              <div
                className="nav-cat"
                style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
                onClick={() => setMegaOpen(o => !o)}
              >
                <svg width="16" height="12" viewBox="0 0 16 12" fill="#111">
                  <rect y="0" width="16" height="2" rx="1"/>
                  <rect y="5" width="16" height="2" rx="1"/>
                  <rect y="10" width="16" height="2" rx="1"/>
                </svg>
                전체 상품 <span style={{ fontSize: 10 }}>▾</span>
              </div>
              {NAV_ITEMS.slice(1).map(item => (
                <span key={item} className="nav-cat" style={{ fontSize: "13px" }}>{item}</span>
              ))}
          </div>

          {/* 메가 드롭다운 */}
          {megaOpen && (
            <div className="mega-dropdown" style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: "#fff", borderTop: "1px solid #eee", borderBottom: "1px solid #eee",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)", zIndex: 100, padding: "28px 0",
            }}>
              <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 200px)", gap: "0 40px" }}>
                  {Object.entries(MEGA_MENU).map(([cat, items]) => (
                    <div key={cat} className="mega-col" style={{ marginBottom: 20 }}>
                      <h4>{cat} {">"}</h4>
                      {items.map(item => (
                        item === "티셔츠"
                          ? <Link key={item} href="/editor" className="mega-item" style={{ textDecoration: "none" }}>{item}</Link>
                          : <span key={item} className="mega-item">{item}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 본문 ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 48px 60px" }}>

        {/* 히어로 카드 3개 가로 배열 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {HERO_CARDS.map((card, i) => (
            <div key={i} className="hero-card" style={{ background: card.bg, height: 420, position: "relative", overflow: "hidden" }}>
              {/* 배경 이미지 */}
              {card.imgLeft && (
                <img src={card.imgLeft} alt="" style={{
                  position: "absolute", top: 0, left: 0,
                  width: card.imgRight ? "55%" : "100%",
                  height: "100%", objectFit: "cover", opacity: 0.55,
                }} />
              )}
              {card.imgRight && (
                <img src={card.imgRight} alt="" style={{
                  position: "absolute", top: 0, right: 0,
                  width: "55%", height: "100%", objectFit: "cover", opacity: 0.45,
                }} />
              )}
              {/* 하단 그라데이션 */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
                background: `linear-gradient(to top, ${card.bg} 40%, transparent 100%)`,
              }} />
              {/* 텍스트 */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                <p style={{
                  fontSize: 20, fontWeight: 900, lineHeight: 1.35,
                  color: card.titleColor, whiteSpace: "pre-line",
                  marginBottom: 8, letterSpacing: "-0.5px",
                  textShadow: `0 0 20px ${card.titleColor}88`,
                }}>
                  {card.title}
                </p>
                <p style={{ fontSize: 12.5, color: card.subColor }}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}