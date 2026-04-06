"use client";
import { useState, useRef, useEffect } from "react";

/* ───── 데이터 ───── */
const MEGA_MENU = {
  "의류": ["티셔츠", "셔츠", "맨투맨", "후드", "집업", "아우터", "바지"],
  "패션잡화": ["가방", "파우치", "모자", "신발/슬리퍼", "양말/장갑", "주얼리/네일", "타투스티커", "스카프/머플러", "지갑/케이스", "마스크"],
};

const NAV_ITEMS = ["전체 상품", "의류", "패션잡화"];

const HERO_CARDS = [
  { title: "요즘은 이렇게\n커스텀 해요",      sub: "Best 후기 바로 보러가기",       bg: "#f5e6d3", emoji: "🔑" },
  { title: "우정 티셔츠\n무료 템플릿 8종",    sub: "사진만 넣으면 완성돼요 🐾",      bg: "#fce4f0", emoji: "👕" },
  { title: "SNS에서 난리난\n'그 복면' 출시",  sub: "올렸다 하면 조회수 100만이에요", bg: "#2a2a2a", emoji: "🎭", dark: true },
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
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
            <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>로그인</span>
            <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>회원가입</span>
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
            <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
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
                        <span key={item} className="mega-item">{item}</span>
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
            <div key={i} className="hero-card" style={{ background: card.bg, height: 420 }}>
              <div style={{ padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
                <div style={{ position: "absolute", top: 20, right: 20, fontSize: 80, opacity: 0.22 }}>{card.emoji}</div>
                <p style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, color: card.dark ? "#fff" : "#111", whiteSpace: "pre-line", marginBottom: 8, letterSpacing: "-0.5px" }}>
                  {card.title}
                </p>
                <p style={{ fontSize: 12.5, color: card.dark ? "rgba(255,255,255,0.65)" : "#555" }}>
                  {card.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}