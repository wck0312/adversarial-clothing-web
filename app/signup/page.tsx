"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim())        newErrors.name    = "이름을 입력해주세요.";
    if (!form.email.trim())       newErrors.email   = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  newErrors.email   = "올바른 이메일 형식이 아닙니다.";
    if (!form.phone.trim())       newErrors.phone   = "전화번호를 입력해주세요.";
    else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/-/g, "")))
                                  newErrors.phone   = "올바른 전화번호 형식이 아닙니다.";
    if (!form.password)           newErrors.password = "비밀번호를 입력해주세요.";
    else if (form.password.length < 8)
                                  newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    if (form.password !== form.passwordConfirm)
                                  newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!agreed)                  newErrors.agree   = "이용약관에 동의해주세요.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    router.push("/login"); // 회원가입 후 로그인 페이지로 이동
  };

  const fields = [
    { key: "name",            label: "이름",        type: "text",     placeholder: "이름을 입력하세요" },
    { key: "email",           label: "이메일",      type: "email",    placeholder: "이메일을 입력하세요" },
    { key: "phone",           label: "전화번호",    type: "tel",      placeholder: "'-' 없이 숫자만 입력하세요" },
    { key: "password",        label: "비밀번호",    type: "password", placeholder: "8자 이상 입력하세요" },
    { key: "passwordConfirm", label: "비밀번호 확인", type: "password", placeholder: "비밀번호를 한 번 더 입력하세요" },
  ];

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", minHeight: "100vh", color: "#111" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .form-input {
          width: 100%; height: 48px; border: 1.5px solid #e0e0e0; border-radius: 8px;
          padding: 0 16px; font-size: 14px; font-family: inherit; color: #111;
          outline: none; transition: border-color 0.15s; background: #fff;
        }
        .form-input:focus { border-color: #111; }
        .form-input::placeholder { color: #bbb; }
        .form-input.error { border-color: #e8541e; }

        .submit-btn {
          width: 100%; height: 50px; background: #111; color: #fff;
          border: none; border-radius: 8px; font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: background 0.15s;
          letter-spacing: -0.3px;
        }
        .submit-btn:hover { background: #333; }

        .checkbox-row {
          display: flex; align-items: center; gap: 10; cursor: pointer;
        }
        .custom-checkbox {
          width: 18px; height: 18px; border: 1.5px solid #ccc; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .custom-checkbox.checked { background: #111; border-color: #111; }
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
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8 }}>회원가입</h1>
            <p style={{ fontSize: 14, color: "#888" }}>ACW 회원이 되어보세요</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map(f => (
              <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{f.label}</label>
                <input
                  className={`form-input${errors[f.key] ? " error" : ""}`}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => update(f.key, e.target.value)}
                />
                {errors[f.key] && (
                  <p style={{ fontSize: 12, color: "#e8541e" }}>{errors[f.key]}</p>
                )}
              </div>
            ))}

            {/* 이용약관 동의 */}
            <div style={{ marginTop: 4 }}>
              <div
                className="checkbox-row"
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                onClick={() => { setAgreed(a => !a); setErrors(prev => ({ ...prev, agree: "" })); }}
              >
                <div className={`custom-checkbox${agreed ? " checked" : ""}`}>
                  {agreed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: "#555" }}>
                  <span style={{ color: "#111", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>이용약관</span> 및{" "}
                  <span style={{ color: "#111", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>개인정보 처리방침</span>에 동의합니다.
                </span>
              </div>
              {errors.agree && (
                <p style={{ fontSize: 12, color: "#e8541e", marginTop: 6 }}>{errors.agree}</p>
              )}
            </div>

            <button className="submit-btn" type="submit" style={{ marginTop: 8 }}>
              회원가입
            </button>
          </form>

          {/* 로그인 유도 */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ fontSize: 14, color: "#888" }}>
              이미 회원이신가요?{" "}
              <Link href="/login" style={{ color: "#111", fontWeight: 700, textDecoration: "none" }}>
                로그인
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}