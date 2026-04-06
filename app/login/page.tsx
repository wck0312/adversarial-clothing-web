"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setError("");
    router.push("/"); // 로그인 후 홈으로 이동
  };

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", minHeight: "100vh", color: "#111" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .form-input {
          width: 100%; height: 48px; border: 1.5px solid #e0e0e0; border-radius: 8px;
          padding: 0 16px; font-size: 14px; font-family: inherit; color: #111;
          outline: none; transition: border-color 0.15s;
          background: #fff;
        }
        .form-input:focus { border-color: #111; }
        .form-input::placeholder { color: #bbb; }

        .submit-btn {
          width: 100%; height: 50px; background: #111; color: #fff;
          border: none; border-radius: 8px; font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: background 0.15s;
          letter-spacing: -0.3px;
        }
        .submit-btn:hover { background: #333; }

        .link-text {
          color: #555; font-size: 13px; text-decoration: none; cursor: pointer;
          transition: color 0.15s;
        }
        .link-text:hover { color: #111; }

        .divider {
          display: flex; align-items: center; gap: 12; margin: 24px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #eee; }
        .divider-text { font-size: 12px; color: #bbb; padding: 0 8px; }
      `}</style>

      {/* 헤더 */}
      <div style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", height: 56, display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-1px", color: "#111" }}>
              <span style={{ color: "#e8541e" }}>A</span>CW
            </span>
          </Link>
        </div>
      </div>

      {/* 폼 영역 */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 57px)", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8 }}>로그인</h1>
            <p style={{ fontSize: 14, color: "#888" }}>ACW에 오신 걸 환영해요</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>이메일</label>
              <input
                className="form-input"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>비밀번호</label>
              <input
                className="form-input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: "#e8541e", marginTop: 2 }}>{error}</p>
            )}

            <button className="submit-btn" type="submit" style={{ marginTop: 8 }}>
              로그인
            </button>
          </form>

          {/* 링크 영역 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
            <span className="link-text">아이디 찾기</span>
            <span style={{ color: "#e0e0e0", fontSize: 13 }}>|</span>
            <span className="link-text">비밀번호 찾기</span>
          </div>

          {/* 구분선 */}
          <div className="divider" style={{ display: "flex", alignItems: "center", margin: "28px 0" }}>
            <div className="divider-line" />
            <span className="divider-text">또는</span>
            <div className="divider-line" />
          </div>

          {/* 회원가입 유도 */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#888" }}>
              아직 회원이 아니신가요?{" "}
              <Link href="/signup" style={{ color: "#111", fontWeight: 700, textDecoration: "none" }}>
                회원가입
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}