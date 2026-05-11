"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

/* ───── 메가메뉴 데이터 ───── */
const MEGA_MENU = {
  "의류": ["티셔츠", "셔츠", "맨투맨", "후드", "집업", "아우터", "바지"],
  "패션잡화": ["가방", "파우치", "모자", "신발/슬리퍼", "양말/장갑", "주얼리/네일",
               "타투스티커", "스카프/머플러", "지갑/케이스", "마스크"],
};

const NAV_ITEMS = ["전체 상품", "의류", "패션잡화"];

export default function TopNav() {
  const router   = useRouter();
  const pathname = usePathname();

  const [megaOpen,   setMegaOpen]   = useState(false);
  const [searchVal,  setSearchVal]  = useState("");
  const [userName,   setUserName]   = useState<string | null>(null); // null = 비로그인
  const megaRef = useRef<HTMLDivElement>(null);

  // ── 로그인 상태 읽기 ──────────────────────────────────────
  // localStorage는 클라이언트에서만 접근 가능하므로 useEffect 안에서 읽어야 함
  useEffect(() => {
    const syncAuth = () => {
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const user = JSON.parse(raw);
          // 백엔드에서 name / username / nickname 등 어떤 키를 쓰는지에 따라 수정하세요
          setUserName(user.name ?? user.username ?? user.nickname ?? null);
        } else {
          setUserName(null);
        }
      } catch {
        setUserName(null);
      }
    };

    syncAuth(); // 첫 렌더 시 바로 읽기

    // 같은 탭에서 login/logout 이벤트를 받기 위해 커스텀 이벤트 리스닝
    window.addEventListener("authChange", syncAuth);
    return () => window.removeEventListener("authChange", syncAuth);
  }, [pathname]); // 페이지 이동 시마다 재확인

  // ── 메가메뉴 외부 클릭 닫기 ──────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── 로그아웃 ──────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName(null);
    // 같은 탭 내 다른 컴포넌트에도 알려주기
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  // ── 로그인 페이지에서는 네비 숨기기 ──────────────────────
  if (pathname === "/login" || pathname === "/signup") return null;

  const isLoggedIn = userName !== null;

  return (
    <>
      <style>{`
        .nav-cat {
          font-size: 13.5px; font-weight: 500; color: #111; cursor: pointer;
          padding: 0 10px; white-space: nowrap; line-height: 46px;
          border-bottom: 2px solid transparent; transition: border-color 0.15s;
        }
        .nav-cat:hover { border-bottom-color: #111; }

        .mega-col h4 { font-size: 13px; font-weight: 700; margin-bottom: 10px; cursor: pointer; }
        .mega-col h4:hover { text-decoration: underline; }
        .mega-item { font-size: 12.5px; color: #444; cursor: pointer; line-height: 1.9; display: block; }
        .mega-item:hover { color: #e8541e; text-decoration: underline; }

        .search-input { width: 100%; border: none; outline: none; font-size: 14px; background: transparent; font-family: inherit; color: #333; }
        .search-input::placeholder { color: #aaa; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .mega-dropdown { animation: fadeIn 0.18s ease; }

        .special-nav-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 13px; border-radius: 4px; font-size: 12.5px; font-weight: 600;
          cursor: pointer; white-space: nowrap; border: 1.5px solid transparent;
          line-height: 1; transition: background 0.15s, color 0.15s, border-color 0.15s;
          font-family: inherit; text-decoration: none;
        }
        .btn-kit  { background: #fff5ee; color: #c94a0a; border-color: #f5c09a; }
        .btn-kit:hover  { background: #e8541e; color: #fff; border-color: #e8541e; }
        .btn-bulk { background: #111; color: #fff; border-color: #111; }
        .btn-bulk:hover { background: #e8541e; border-color: #e8541e; color: #fff; }

        .logout-btn {
          font-size: 12px; color: #555; background: none; border: none;
          cursor: pointer; font-family: inherit; padding: 0;
          transition: color 0.15s;
        }
        .logout-btn:hover { color: #e8541e; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "-0.3px" }}>안보EASY</span>
            <span style={{ width: 1, height: 12, background: "#ddd" }} />
            <span style={{ fontSize: 12, color: "#888", letterSpacing: "0.2px" }}>Adversarial Clothing Web</span>
          </div>

          {/* 로그인 전: 로그인 / 회원가입 | 로그인 후: OO님 + 로그아웃 */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>KR ▾</span>
            {isLoggedIn ? (
              <>
                <span style={{ fontSize: 12, color: "#333", fontWeight: 600 }}>
                  {userName}님
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login"  style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>로그인</Link>
                <Link href="/signup" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <div style={{ borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 40, background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", gap: 16, height: 60 }}>

          {/* 로고 */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px" }}>
              <span style={{ color: "#e8541e" }}>A</span>CW
            </span>
          </Link>

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

            {/* 기업/웰컴 키트 · 대량 주문 */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "0 0 0 16px", flexShrink: 0 }}>
              <span className="special-nav-btn btn-kit">기업/웰컴 키트</span>
              <span className="special-nav-btn btn-bulk">대량 주문</span>
            </div>
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
    </>
  );
}