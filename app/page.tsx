"use client";

/* 네비바는 layout.tsx의 TopNav 컴포넌트가 담당합니다 */

const HERO_CARDS = [
  {
    title: "나만의 스타일을\n거리에 새기다",
    sub: "그래피티 아트 커스텀 티셔츠",
    bg: "#0a0a0a",
    imgLeft: "/hero-graffiti1.png",
    imgRight: "/hero-graffiti2.png",
    titleColor: "#FF6B1A",
    subColor: "rgba(255,255,255,0.6)",
  },
  {
    title: "평범함을 거부하는\n당신을 위한 디자인",
    sub: "강렬한 컬러로 나를 표현하세요",
    bg: "#1a0a2e",
    imgLeft: "/hero-popart.png",
    imgRight: "/hero-tiger.png",
    titleColor: "#FF69B4",
    subColor: "rgba(255,255,255,0.6)",
  },
  {
    title: "디지털 감성을\n입다",
    sub: "글리치 아트로 완성된 나만의 한 장",
    bg: "#111111",
    imgLeft: "/hero-glitch.png",
    imgRight: null,
    titleColor: "#00FFFF",
    subColor: "rgba(255,255,255,0.6)",
  },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-card { border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
        .hero-card:hover { transform: scale(1.01); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 48px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {HERO_CARDS.map((card, i) => (
            <div key={i} className="hero-card" style={{ background: card.bg, height: 420, position: "relative", overflow: "hidden" }}>
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
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
                background: `linear-gradient(to top, ${card.bg} 40%, transparent 100%)`,
              }} />
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