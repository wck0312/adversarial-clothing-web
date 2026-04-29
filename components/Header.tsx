"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLogin(!!token);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/";
  };

  return (
    <div>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 36 }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>안보EASY</span>
            <span style={{ width: 1, height: 12, background: "#ddd" }} />
            <span style={{ fontSize: 12, color: "#888" }}>Adversarial Clothing Web</span>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {!isLogin ? (
              <>
                <Link href="/login" style={{ fontSize: 11, color: "#555", textDecoration: "none" }}>로그인</Link>
                <Link href="/signup" style={{ fontSize: 11, color: "#555", textDecoration: "none" }}>회원가입</Link>
              </>
            ) : (
              <>
                <span style={{ fontSize: 11 }}>{user?.name}님</span>
                <button onClick={handleLogout} style={{ fontSize: 11, background: "none", border: "none", cursor: "pointer" }}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", height: 56 }}>

          <Link href="/">
            <span style={{ fontSize: 20, fontWeight: 900 }}>
              <span style={{ color: "#e8541e" }}>A</span>CW
            </span>
          </Link>

          {/* 검색 */}
          <div style={{ width: 320, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", height: 36, marginLeft: 16 }}>
            <input placeholder="검색어를 입력하세요" style={{ border: "none", outline: "none", background: "transparent", width: "100%" }} />
          </div>

          {/* 🔥 원래 SVG 아이콘 복구 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
            <Link href="/wish">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78"/>
              </svg>
            </Link>

            <Link href="/cart">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              </svg>
            </Link>

            <Link href="/my-page">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}