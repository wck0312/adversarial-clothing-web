"use client";
import Link from "next/link";

const NAV_TABS = ["구매내역", "찜한 상품", "포인트", "나의 리뷰", "계정 설정"];

const ORDER_STEPS = [
  { label: "결제 확인",    desc: "주문이 접수되었습니다.\n결제 확인 후 다음단계로 진행됩니다." },
  { label: "제작 준비중",  desc: "주문하신 커스텀 사양을 확인하고,\n제작을 준비하고 있습니다." },
  { label: "제작중",       desc: "주문하신 커스텀 상품을\n제작하고 있습니다." },
  { label: "배송 준비중",  desc: "상품 배송을 준비하고 있습니다." },
  { label: "배송중",       desc: "물품이 발송되어\n고객님께 배송중입니다." },
  { label: "배송 완료",    desc: "배송이 완료되었습니다.\n배송 완료일 포함 7일 이내\n교환/반품신청이 가능합니다." },
];

export default function MyPage() {
  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .search-input { width: 100%; border: none; outline: none; font-size: 13px; background: transparent; font-family: inherit; color: #333; }
        .search-input::placeholder { color: #aaa; }
        .my-tab { font-size: 14px; color: #888; cursor: pointer; padding-bottom: 2px; border-bottom: 2px solid transparent; transition: all 0.15s; text-decoration: none; }
        .my-tab:hover { color: #111; }
        .my-tab.active { color: #111; font-weight: 700; border-bottom-color: #111; }
        .order-col { text-align: center; flex: 1; }
        .order-num { font-size: 28px; font-weight: 800; color: #aaa; margin-bottom: 6px; }
        .order-label { font-size: 13px; font-weight: 600; color: #ddd; margin-bottom: 8px; }
        .order-desc { font-size: 11px; color: #666; line-height: 1.6; white-space: pre-line; }
      `}</style>

      {/* ── 상단 네비 ── */}
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

        <Link href="/my-page" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px", cursor: "pointer", color: "#111" }}>마이페이지</h1>
        </Link>

        {/* 탭 — 어떤 탭도 굵게 활성화되지 않음 */}
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

        {/* 유저 요약 카드 */}
        <div style={{ background: "#111", borderRadius: 16, padding: "32px 40px", display: "flex", alignItems: "center", gap: 0, marginBottom: 48 }}>
          {/* 유저 이름 */}
          <div style={{ flex: 2 }}>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 6, cursor: "pointer" }}>개인정보 변경</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              사용자 님,<br />반가워요 👋
            </p>
          </div>
          {/* 구분선 */}
          <div style={{ width: 1, height: 60, background: "#333", margin: "0 32px" }} />
          {/* 통계 */}
          {[
            { label: "리뷰", value: "0 / 0 개" },
            { label: "장바구니", value: "0 개" },
            { label: "찜한 상품", value: "0 개" },
            { label: "포인트", value: "0 P" },
          ].map((item, i) => (
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
          {ORDER_STEPS.map((step, i) => (
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