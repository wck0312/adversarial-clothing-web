"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COLORS = [
  { name: "화이트", hex: "#FFFFFF", border: true },
  { name: "블랙", hex: "#111111" },
];

const SIZES = [
  { label: "S", extra: 0 },
  { label: "M", extra: 0 },
  { label: "L", extra: 0 },
  { label: "XL", extra: 0 },
  { label: "2XL", extra: 2000 },
  { label: "3XL", extra: 2000 },
];

const BASE_PRICE = 9000;

type SideType = "앞면" | "뒷면";
type DesignTransform = { x: number; y: number; size: number };
type DesignState = { front: DesignTransform; back: DesignTransform };
type ResizeHandle = "nw" | "ne" | "sw" | "se";

const DEFAULT_TRANSFORM: DesignTransform = { x: 0, y: 0, size: 120 };
const DEFAULT_DESIGN_STATE: DesignState = {
  front: { ...DEFAULT_TRANSFORM },
  back: { ...DEFAULT_TRANSFORM },
};

const PRINT_AREA = { width: 170, height: 250 };
const MOVE_STEP = 6;
const MIN_SIZE = 40;
const MAX_SIZE = 220;

export default function EditorPage() {
  const router = useRouter();
  const [activeColor, setActiveColor] = useState("#FFFFFF");
  const [activeSize, setActiveSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [viewSide, setViewSide] = useState<SideType>("앞면");
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [selectedDesign, setSelectedDesign] = useState(false);
  const [cartMsg, setCartMsg] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  const [designState, setDesignState] = useState<DesignState>(DEFAULT_DESIGN_STATE);
  const [history, setHistory] = useState<DesignState[]>([]);
  const [redoHistory, setRedoHistory] = useState<DesignState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandle | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef<{ startClientX: number; startClientY: number; startX: number; startY: number } | null>(null);
  const resizeStartRef = useRef<{ startClientX: number; startClientY: number; startSize: number; handle: ResizeHandle } | null>(null);

  const selectedSize = SIZES.find((s) => s.label === activeSize)!;
  const totalPrice = (BASE_PRICE + selectedSize.extra) * quantity;
  const tshirtImageSrc = viewSide === "앞면" ? "/images/tshirt-front.png" : "/images/tshirt-back.png";
  const currentTransform = designState[viewSide === "앞면" ? "front" : "back"];
  const hasDesign = !!uploadedImg;

  const clampTransform = (transform: DesignTransform): DesignTransform => {
    const clampedSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, transform.size));
    const halfW = clampedSize / 2;
    const halfH = clampedSize / 2;
    return {
      x: Math.max(-PRINT_AREA.width / 2 + halfW, Math.min(PRINT_AREA.width / 2 - halfW, transform.x)),
      y: Math.max(-PRINT_AREA.height / 2 + halfH, Math.min(PRINT_AREA.height / 2 - halfH, transform.y)),
      size: clampedSize,
    };
  };

  const pushHistorySnapshot = () => {
    setHistory((prev) => [...prev, designState]);
    setRedoHistory([]);
  };

  const updateCurrentSideTransform = (
    updater: (prev: DesignTransform) => DesignTransform,
    options?: { saveHistory?: boolean }
  ) => {
    if (options?.saveHistory !== false) pushHistorySnapshot();
    setDesignState((prev) => {
      const sideKey = viewSide === "앞면" ? "front" : "back";
      return { ...prev, [sideKey]: clampTransform(updater(prev[sideKey])) };
    });
  };

  const resetCurrentSide = () => { if (!hasDesign) return; updateCurrentSideTransform(() => ({ ...DEFAULT_TRANSFORM })); setSelectedDesign(true); };
  const deleteImage = () => { if (!uploadedImg) return; pushHistorySnapshot(); setUploadedImg(null); setDesignState(DEFAULT_DESIGN_STATE); setSelectedDesign(false); };
  const undo = () => { if (history.length === 0) return; const previous = history[history.length - 1]; setHistory((prev) => prev.slice(0, -1)); setRedoHistory((prev) => [...prev, designState]); setDesignState(previous); setSelectedDesign(true); };
  const redo = () => { if (redoHistory.length === 0) return; const next = redoHistory[redoHistory.length - 1]; setRedoHistory((prev) => prev.slice(0, -1)); setHistory((prev) => [...prev, designState]); setDesignState(next); setSelectedDesign(true); };
  const nudgePosition = (direction: "left" | "right" | "up" | "down") => {
    if (!hasDesign) return;
    updateCurrentSideTransform((prev) => {
      if (direction === "left") return { ...prev, x: prev.x - MOVE_STEP };
      if (direction === "right") return { ...prev, x: prev.x + MOVE_STEP };
      if (direction === "up") return { ...prev, y: prev.y - MOVE_STEP };
      return { ...prev, y: prev.y + MOVE_STEP };
    });
    setSelectedDesign(true);
  };

  const handleToolbarAction = (label: string) => {
    switch (label) {
      case "처음으로": resetCurrentSide(); break;
      case "취소": undo(); break;
      case "다시실행": redo(); break;
      case "삭제": deleteImage(); break;
      case "왼쪽": nudgePosition("left"); break;
      case "가운데": updateCurrentSideTransform((prev) => ({ ...prev, x: 0 })); setSelectedDesign(true); break;
      case "오른쪽": nudgePosition("right"); break;
      case "위": nudgePosition("up"); break;
      case "아래": nudgePosition("down"); break;
    }
  };

  const toolbarItems = useMemo(() => [
    { icon: "↺", label: "처음으로", disabled: !hasDesign },
    { icon: "↩", label: "취소", disabled: history.length === 0 },
    { icon: "↪", label: "다시실행", disabled: redoHistory.length === 0 },
    { icon: "🗑", label: "삭제", disabled: !hasDesign },
    { icon: "◁", label: "왼쪽", disabled: !hasDesign },
    { icon: "□", label: "가운데", disabled: !hasDesign },
    { icon: "▷", label: "오른쪽", disabled: !hasDesign },
    { icon: "△", label: "위", disabled: !hasDesign },
    { icon: "▽", label: "아래", disabled: !hasDesign },
  ], [hasDesign, history.length, redoHistory.length]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (uploadedImg) URL.revokeObjectURL(uploadedImg);
    setUploadedImg(url);
    setActiveTab(null);
    setHistory([]);
    setRedoHistory([]);
    setDesignState(DEFAULT_DESIGN_STATE);
    setSelectedDesign(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── 장바구니 담기 ──────────────────────────────────────────
  const handleAddToCart = async () => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(raw);
    const colorName = COLORS.find((c) => c.hex === activeColor)?.name ?? "화이트";

    try {
      setCartLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": String(user.id),
        },
        body: JSON.stringify({
          product_name: "2000 오리지널 티셔츠",
          color: colorName,
          size: activeSize,
          quantity,
          price: totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartMsg("장바구니에 담겼어요! 🛍");
        setTimeout(() => setCartMsg(null), 2500);
      } else {
        setCartMsg(data.message ?? "오류가 발생했습니다.");
        setTimeout(() => setCartMsg(null), 2500);
      }
    } catch {
      setCartMsg("서버 연결 오류");
      setTimeout(() => setCartMsg(null), 2500);
    } finally {
      setCartLoading(false);
    }
  };

  const handlePointerDownOnImage = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasDesign || activeResizeHandle) return;
    e.preventDefault(); e.stopPropagation();
    setSelectedDesign(true); setIsDragging(true);
    dragStartRef.current = { startClientX: e.clientX, startClientY: e.clientY, startX: currentTransform.x, startY: currentTransform.y };
    pushHistorySnapshot();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerDown = (handle: ResizeHandle) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasDesign) return;
    e.preventDefault(); e.stopPropagation();
    setSelectedDesign(true); setActiveResizeHandle(handle);
    resizeStartRef.current = { startClientX: e.clientX, startClientY: e.clientY, startSize: currentTransform.size, handle };
    pushHistorySnapshot();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging && dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.startClientX;
        const dy = e.clientY - dragStartRef.current.startClientY;
        const nextTransform = clampTransform({ ...currentTransform, x: dragStartRef.current.startX + dx, y: dragStartRef.current.startY + dy });
        setDesignState((prev) => { const sideKey = viewSide === "앞면" ? "front" : "back"; return { ...prev, [sideKey]: nextTransform }; });
      }
      if (activeResizeHandle && resizeStartRef.current) {
        const dx = e.clientX - resizeStartRef.current.startClientX;
        const dy = e.clientY - resizeStartRef.current.startClientY;
        const handle = resizeStartRef.current.handle;
        let sizeDelta = 0;
        if (handle === "se") sizeDelta = Math.max(dx, dy);
        if (handle === "nw") sizeDelta = Math.max(-dx, -dy);
        if (handle === "ne") sizeDelta = Math.max(dx, -dy);
        if (handle === "sw") sizeDelta = Math.max(-dx, dy);
        const nextTransform = clampTransform({ ...currentTransform, size: resizeStartRef.current.startSize + sizeDelta });
        setDesignState((prev) => { const sideKey = viewSide === "앞면" ? "front" : "back"; return { ...prev, [sideKey]: nextTransform }; });
      }
    };
    const handlePointerUp = () => { setIsDragging(false); setActiveResizeHandle(null); dragStartRef.current = null; resizeStartRef.current = null; };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => { window.removeEventListener("pointermove", handlePointerMove); window.removeEventListener("pointerup", handlePointerUp); };
  }, [isDragging, activeResizeHandle, currentTransform, viewSide]);

  useEffect(() => { return () => { if (uploadedImg) URL.revokeObjectURL(uploadedImg); }; }, [uploadedImg]);

  return (
    <div
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      onClick={() => { if (selectedDesign) setSelectedDesign(false); }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .search-input { width: 100%; border: none; outline: none; font-size: 13px; background: transparent; font-family: inherit; color: #333; }
        .search-input::placeholder { color: #aaa; }
        .tool-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 6px 10px; color: #555; font-size: 10.5px; transition: color 0.15s, background 0.15s, opacity 0.15s; border-radius: 6px; min-width: 48px; user-select: none; border: none; background: transparent; font-family: inherit; }
        .tool-btn:hover { color: #111; background: #f0f0f0; }
        .tool-btn.disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
        .tool-icon { font-size: 16px; line-height: 1; }
        .right-tool { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; padding: 12px 0; font-size: 11px; font-weight: 500; color: #444; transition: color 0.15s; border-radius: 8px; position: relative; }
        .right-tool:hover { color: #111; background: #f8f8f8; }
        .color-sw { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; flex-shrink: 0; transition: transform 0.15s; }
        .color-sw:hover { transform: scale(1.18); }
        .color-sw.active { outline: 2.5px solid #e8541e; outline-offset: 2px; }
        .size-btn { border: 1.5px solid #e0e0e0; border-radius: 8px; padding: 9px 0; font-size: 13px; font-weight: 500; cursor: pointer; background: white; transition: border-color 0.15s; text-align: center; color: #333; }
        .size-btn:hover { border-color: #e8541e; }
        .size-btn.active { border-color: #e8541e; color: #e8541e; font-weight: 700; }
        .cart-btn { width: 100%; height: 52px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; letter-spacing: -0.3px; }
        .cart-btn:hover { background: #333; }
        .cart-btn:disabled { background: #999; cursor: not-allowed; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .cart-toast { animation: fadeInUp 0.2s ease; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ borderBottom: "1px solid #eee", flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>안보EASY</span>
            <span style={{ width: 1, height: 11, background: "#ddd" }} />
            <span style={{ fontSize: 11, color: "#888" }}>Adversarial Clothing Web</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#555", cursor: "pointer" }}>KR ▾</span>
            <Link href="/login" style={{ fontSize: 11, color: "#555", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>로그인</Link>
            <Link href="/signup" style={{ fontSize: 11, color: "#555", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>회원가입</Link>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <div style={{ borderBottom: "1px solid #eee", flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", gap: 16, height: 52 }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-1px", color: "#111" }}><span style={{ color: "#e8541e" }}>A</span>CW</span>
          </Link>
          <div style={{ width: 320, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", height: 36, gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <svg width="14" height="14" fill="none" stroke="#999" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="search-input" placeholder="검색어를 입력하세요" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }} onClick={(e) => e.stopPropagation()}>
            <Link href="/wish" style={{ display: "flex" }}><svg width="18" height="18" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></Link>
            <Link href="/cart" style={{ display: "flex" }}><svg width="18" height="18" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></Link>
            <Link href="/my-page" style={{ display: "flex" }}><svg width="18" height="18" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24" style={{ cursor: "pointer" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></Link>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{ background: "#f8f8f8", borderBottom: "1px solid #e5e5e5", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 0", gap: 2, flexWrap: "wrap" }}>
          {toolbarItems.map((t, i) => (
            <button key={i} className={`tool-btn${t.disabled ? " disabled" : ""}`} onClick={() => handleToolbarAction(t.label)} type="button">
              <span className="tool-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1200, display: "flex", overflow: "hidden" }}>

          {/* 캔버스 영역 */}
          <div style={{ flex: 1, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
              {(["앞면", "뒷면"] as const).map((side) => (
                <button key={side} onClick={() => { setViewSide(side); setSelectedDesign(false); }}
                  style={{ background: viewSide === side ? "#111" : "#fff", color: viewSide === side ? "#fff" : "#333", border: "1.5px solid #ddd", borderRadius: 50, padding: "5px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {side}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", width: 420, height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={tshirtImageSrc} alt={viewSide} style={{ width: 360, height: "auto", objectFit: "contain", userSelect: "none", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "49%", left: "50%", transform: "translate(-50%, -50%)", width: PRINT_AREA.width, height: PRINT_AREA.height, border: "2px solid #444", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "transparent" }}
                onClick={() => { if (!uploadedImg) setSelectedDesign(false); }}>
                {uploadedImg ? (
                  <div onPointerDown={handlePointerDownOnImage} onClick={(e) => { e.stopPropagation(); setSelectedDesign(true); }}
                    style={{ position: "absolute", left: "50%", top: "50%", width: currentTransform.size, height: currentTransform.size, transform: `translate(calc(-50% + ${currentTransform.x}px), calc(-50% + ${currentTransform.y}px))`, cursor: isDragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}>
                    <img src={uploadedImg} alt="design" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", userSelect: "none" }} />
                    {selectedDesign && (
                      <>
                        <div style={{ position: "absolute", inset: 0, border: "1.5px solid #f59e0b", borderRadius: 4, pointerEvents: "none" }} />
                        {(["nw","ne","sw","se"] as ResizeHandle[]).map((handle) => (
                          <div key={handle} onPointerDown={handleResizePointerDown(handle)}
                            style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "#f4a261", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", touchAction: "none", cursor: handle === "nw" || handle === "se" ? "nwse-resize" : "nesw-resize",
                              ...(handle === "nw" ? { left: -7, top: -7 } : handle === "ne" ? { right: -7, top: -7 } : handle === "sw" ? { left: -7, bottom: -7 } : { right: -7, bottom: -7 }) }} />
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: "#999", textAlign: "center", padding: "0 8px" }}>디자인 영역</span>
                )}
              </div>
            </div>
          </div>

          {/* 우측 툴 패널 */}
          <div style={{ width: 88, background: "#fff", borderLeft: "1px solid #eee", display: "flex", flexDirection: "column", paddingTop: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="right-tool" onClick={() => setActiveTab(activeTab === "상품" ? null : "상품")}>
              <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
              <span>상품 변경</span>
            </div>
            <div className="right-tool" onClick={() => fileRef.current?.click()}>
              <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              <span>이미지 업로드</span>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
            </div>
            <div className="right-tool" onClick={() => setActiveTab(null)}>
              <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5" fill="#333"/><circle cx="17.5" cy="10.5" r=".5" fill="#333"/><circle cx="8.5" cy="7.5" r=".5" fill="#333"/><circle cx="6.5" cy="12.5" r=".5" fill="#333"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
              <span>디자인</span>
            </div>
          </div>

          {/* 우측 옵션 패널 */}
          <div style={{ width: 300, background: "#fff", borderLeft: "1px solid #eee", overflowY: "auto", padding: "20px 20px 80px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>길단</p>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.4px" }}>2000 오리지널 티셔츠</h2>
            <p style={{ fontSize: 13, color: "#333", marginBottom: 20 }}>1개당 <strong style={{ fontSize: 17, fontWeight: 800 }}>9,000원</strong></p>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>색상 – {COLORS.find((c) => c.hex === activeColor)?.name ?? "화이트"}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COLORS.map((c) => (
                  <div key={c.hex} className={`color-sw${activeColor === c.hex ? " active" : ""}`}
                    style={{ background: c.hex, border: c.border ? "1.5px solid #e0e0e0" : "none" }}
                    onClick={() => setActiveColor(c.hex)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>사이즈</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {SIZES.map((s) => (
                  <button key={s.label} className={`size-btn${activeSize === s.label ? " active" : ""}`} onClick={() => setActiveSize(s.label)}>
                    <div>{s.label}</div>
                    {s.extra > 0 && <div style={{ fontSize: 10, color: "#999" }}>+{s.extra.toLocaleString()}</div>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ border: "1.5px solid #e0e0e0", borderRadius: 4, width: 28, height: 28, background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 24, textAlign: "center" }}>{quantity}개</span>
                <button onClick={() => setQuantity((q) => q + 1)} style={{ border: "1.5px solid #e0e0e0", borderRadius: 4, width: 28, height: 28, background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{totalPrice.toLocaleString()}원</span>
            </div>

            {/* 장바구니 담기 버튼 + 토스트 메시지 */}
            {cartMsg && (
              <div className="cart-toast" style={{ background: "#111", color: "#fff", borderRadius: 8, padding: "12px 16px", fontSize: 13, fontWeight: 600, textAlign: "center", marginBottom: 10 }}>
                {cartMsg}
              </div>
            )}
            <button className="cart-btn" onClick={handleAddToCart} disabled={cartLoading}>
              {cartLoading ? "담는 중..." : "장바구니 담기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
