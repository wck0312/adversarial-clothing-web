"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── HF Space URL ───────────────────────────────────────────
const HF_SPACE_URL = "https://kcw0312-adversarial-attack-api.hf.space";

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

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  text: string;
  patchSvg?: string;
};

// ── AI 패치+ 결과 타입 ─────────────────────────────────────
type AdvResult = {
  original: { label: string; confidence: number; image: string };
  adversarial: { label: string; confidence: number; image: string };
  success: boolean;
  attack_type: string;
  epsilon: number;
};

const QUICK_CHIPS = [
  "빈티지 아메리칸 스타일 패치",
  "일본 애니메이션 감성 패치",
  "미니멀 텍스트 패치",
  "다크 고딕 해골 패치",
];

const PATCH_SVG_PLACEHOLDER = `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" width="90" height="90">
  <ellipse cx="45" cy="45" rx="42" ry="38" fill="#1a1a2e" stroke="#e8541e" stroke-width="2.5"/>
  <ellipse cx="45" cy="45" rx="36" ry="32" fill="none" stroke="#e8541e" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="45" y="34" text-anchor="middle" fill="#e8541e" font-size="7" font-weight="700" font-family="Arial" letter-spacing="3">ADVERSARIAL</text>
  <text x="45" y="52" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900" font-family="Arial" letter-spacing="1">ACW</text>
  <text x="45" y="63" text-anchor="middle" fill="#aaa" font-size="6" font-family="Arial" letter-spacing="2">EST. 2024</text>
  <path d="M20 68 L45 73 L70 68" fill="none" stroke="#e8541e" stroke-width="1"/>
</svg>`;

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

  // ── AI 패치 채팅 상태 ───────────────────────────────────────────
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "ai",
      text: "안녕하세요! 원하시는 패치 디자인을 설명해주세요.\n스타일, 색상, 텍스트 등을 알려주시면 만들어 드릴게요.",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const aiTextareaRef = useRef<HTMLTextAreaElement>(null);

  // ── AI 패치+ 상태 ────────────────────────────────────────────────
  const [advPanelOpen, setAdvPanelOpen] = useState(false);
  const [advFile, setAdvFile] = useState<File | null>(null);
  const [advPreview, setAdvPreview] = useState<string | null>(null);
  const [advAttackType, setAdvAttackType] = useState<"fgsm" | "pgd">("fgsm");
  const [advEpsilon, setAdvEpsilon] = useState(0.03);
  const [advSteps, setAdvSteps] = useState(10);
  const [advLoading, setAdvLoading] = useState(false);
  const [advResult, setAdvResult] = useState<AdvResult | null>(null);
  const [advError, setAdvError] = useState<string | null>(null);
  const advFileRef = useRef<HTMLInputElement>(null);

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

  // ── AI 패치+ 이미지 선택 ──────────────────────────────────────
  const handleAdvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdvFile(file);
    setAdvResult(null);
    setAdvError(null);
    const url = URL.createObjectURL(file);
    if (advPreview) URL.revokeObjectURL(advPreview);
    setAdvPreview(url);
    if (advFileRef.current) advFileRef.current.value = "";
  };

  // ── AI 패치+ 공격 실행 ────────────────────────────────────────
  const handleAdvAttack = async () => {
    if (!advFile || advLoading) return;
    setAdvLoading(true);
    setAdvResult(null);
    setAdvError(null);

    try {
      const fd = new FormData();
      fd.append("file", advFile);
      fd.append("attack_type", advAttackType);
      fd.append("epsilon", String(advEpsilon));
      fd.append("steps", String(advSteps));

      const res = await fetch(`${HF_SPACE_URL}/attack`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `서버 오류 (${res.status})`);
      }

      const data: AdvResult = await res.json();
      setAdvResult(data);
    } catch (err: any) {
      setAdvError(err.message ?? "알 수 없는 오류가 발생했습니다.");
    } finally {
      setAdvLoading(false);
    }
  };

  // ── AI 패치+ 결과 → 캔버스 적용 ──────────────────────────────
  const handleAdvApply = (b64: string) => {
    const url = `data:image/png;base64,${b64}`;
    if (uploadedImg) URL.revokeObjectURL(uploadedImg);
    setUploadedImg(url);
    setDesignState(DEFAULT_DESIGN_STATE);
    setHistory([]);
    setRedoHistory([]);
    setSelectedDesign(false);
    setAdvPanelOpen(false);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
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
  useEffect(() => { return () => { if (advPreview) URL.revokeObjectURL(advPreview); }; }, [advPreview]);

  // ── AI 채팅 스크롤 ─────────────────────────────────────────
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, aiLoading]);

  // ── AI 패치 전송 ───────────────────────────────────────────
  const handleAiSend = async () => {
    const text = aiInput.trim();
    if (!text || aiLoading) return;
    setAiInput("");

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setAiLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1800));

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      text: "요청하신 스타일로 패치를 생성했어요! 마음에 드시면 캔버스에 바로 적용하실 수 있어요.",
      patchSvg: PATCH_SVG_PLACEHOLDER,
    };
    setChatMessages((prev) => [...prev, aiMsg]);
    setAiLoading(false);
  };

  const handleAiKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSend();
    }
  };

  const handleChipClick = (chip: string) => {
    setAiInput(chip);
    aiTextareaRef.current?.focus();
  };

  const handleApplyPatch = (svgString: string) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    if (uploadedImg) URL.revokeObjectURL(uploadedImg);
    setUploadedImg(url);
    setDesignState(DEFAULT_DESIGN_STATE);
    setHistory([]);
    setRedoHistory([]);
    setSelectedDesign(false);
  };

  const handleRegenerate = async (msgId: string) => {
    setAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, patchSvg: PATCH_SVG_PLACEHOLDER }
          : m
      )
    );
    setAiLoading(false);
  };

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
        .right-tool.active { color: #e8541e; background: #fff5f2; }
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
        .ai-panel { display: flex; flex-direction: column; background: #fff; border-left: 1px solid #eee; overflow: hidden; transition: width 0.25s ease; flex-shrink: 0; }
        .ai-panel.open { width: 300px; }
        .ai-panel.closed { width: 0; }
        .ai-chip { font-size: 11px; border: 1px solid #e8e8e8; border-radius: 20px; padding: 4px 10px; cursor: pointer; color: #666; background: #fff; white-space: nowrap; font-family: inherit; transition: border-color 0.15s, color 0.15s; }
        .ai-chip:hover { border-color: #e8541e; color: #e8541e; }
        .ai-send-btn { width: 32px; height: 32px; background: #111; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
        .ai-send-btn:hover { background: #333; }
        .ai-send-btn:disabled { background: #ccc; cursor: not-allowed; }
        .ai-textarea { flex: 1; border: 1px solid #e5e5e5; border-radius: 8px; padding: 8px 10px; font-size: 12px; resize: none; outline: none; font-family: inherit; color: #222; background: #fafafa; line-height: 1.45; min-height: 36px; max-height: 80px; }
        .ai-textarea:focus { border-color: #ccc; background: #fff; }
        .patch-action-btn { flex: 1; border: none; background: none; font-size: 11px; font-weight: 600; padding: 8px 0; cursor: pointer; color: #555; font-family: inherit; transition: background 0.1s; }
        .patch-action-btn:first-child { border-right: 1px solid #f0f0f0; }
        .patch-action-btn:hover { background: #fafafa; }
        .patch-action-btn.primary { color: #e8541e; }
        @keyframes typing { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }
        .dot { width: 5px; height: 5px; border-radius: 50%; background: #ccc; animation: typing 1.2s infinite; display: inline-block; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .adv-upload-zone { border: 1.5px dashed #ddd; border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.15s; background: #fafafa; }
        .adv-upload-zone:hover { border-color: #e8541e; }
        .adv-attack-btn { width: 100%; height: 38px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .adv-attack-btn:hover { background: #333; }
        .adv-attack-btn:disabled { background: #ccc; cursor: not-allowed; }
        .adv-apply-btn { width: 100%; height: 36px; background: #e8541e; color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .adv-apply-btn:hover { background: #d4461a; }
        .adv-select { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 6px; padding: 5px 8px; font-size: 12px; font-family: inherit; color: #333; outline: none; width: 100%; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #eee; border-top-color: #e8541e; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
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

            {/* AI 패치 버튼 */}
            <div
              className={`right-tool${aiPanelOpen ? " active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setAiPanelOpen((v) => !v); if (advPanelOpen) setAdvPanelOpen(false); }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>AI 패치</span>
              <span style={{ position: "absolute", top: 8, right: 6, background: "#fff5f0", color: "#e8541e", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 20, border: "1px solid #fdd0b8", lineHeight: 1.5 }}>β</span>
            </div>

            {/* AI 패치+ 버튼 */}
            <div
              className={`right-tool${advPanelOpen ? " active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setAdvPanelOpen((v) => !v); if (aiPanelOpen) setAiPanelOpen(false); }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>AI 패치+</span>
              <span style={{ position: "absolute", top: 8, right: 6, background: "#f0fff4", color: "#22a35a", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 20, border: "1px solid #b7ebc9", lineHeight: 1.5 }}>NEW</span>
            </div>
          </div>

          {/* AI 패치 채팅 패널 */}
          <div className={`ai-panel ${aiPanelOpen ? "open" : "closed"}`} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#111" }}>
                <svg width="15" height="15" fill="none" stroke="#e8541e" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                  <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                AI 패치 생성
                <span style={{ background: "#fff5f0", color: "#e8541e", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, border: "1px solid #fdd0b8" }}>BETA</span>
              </div>
              <button onClick={() => setAiPanelOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#999", fontSize: 18, lineHeight: 1, padding: "2px 4px", borderRadius: 4, fontFamily: "inherit" }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMessages.map((msg, idx) => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: 10, color: "#aaa", marginBottom: 1 }}>{msg.role === "ai" ? "AI" : "나"}</span>
                  <div style={{ fontSize: 12, lineHeight: 1.5, padding: "8px 11px", maxWidth: 220, whiteSpace: "pre-wrap", background: msg.role === "ai" ? "#f5f5f5" : "#111", color: msg.role === "ai" ? "#222" : "#fff", borderRadius: msg.role === "ai" ? "0 10px 10px 10px" : "10px 10px 0 10px" }}>
                    {msg.text}
                  </div>
                  {msg.role === "ai" && idx === 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
                      {QUICK_CHIPS.map((chip) => (
                        <button key={chip} className="ai-chip" onClick={() => handleChipClick(chip)}>{chip}</button>
                      ))}
                    </div>
                  )}
                  {msg.patchSvg && (
                    <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", marginTop: 4, width: 220 }}>
                      <div style={{ background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0" }} dangerouslySetInnerHTML={{ __html: msg.patchSvg }} />
                      <div style={{ display: "flex", borderTop: "1px solid #f0f0f0" }}>
                        <button className="patch-action-btn" onClick={() => handleRegenerate(msg.id)}>다시 생성</button>
                        <button className="patch-action-btn primary" onClick={() => handleApplyPatch(msg.patchSvg!)}>캔버스에 적용</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 10, color: "#aaa" }}>AI</span>
                  <div style={{ background: "#f5f5f5", borderRadius: "0 10px 10px 10px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div style={{ padding: "10px 12px 12px", borderTop: "1px solid #f0f0f0", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                <textarea ref={aiTextareaRef} className="ai-textarea" rows={1} placeholder="패치 스타일을 설명해주세요..." value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={handleAiKeyDown} />
                <button className="ai-send-btn" onClick={handleAiSend} disabled={aiLoading || !aiInput.trim()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="#fff" stroke="none"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── AI 패치+ 패널 ───────────────────────────────────── */}
          <div className={`ai-panel ${advPanelOpen ? "open" : "closed"}`} onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#111" }}>
                <svg width="15" height="15" fill="none" stroke="#22a35a" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                  <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                AI 패치+
                <span style={{ background: "#f0fff4", color: "#22a35a", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, border: "1px solid #b7ebc9" }}>NEW</span>
              </div>
              <button onClick={() => setAdvPanelOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#999", fontSize: 18, lineHeight: 1, padding: "2px 4px", borderRadius: 4, fontFamily: "inherit" }}>×</button>
            </div>

            {/* 본문 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
              {/* 설명 */}
              <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginBottom: 14 }}>
                이미지를 업로드하면 AI가 적대적 변환(FGSM/PGD)을 적용해 독특한 패치 이미지를 만들어줘요. 결과물을 바로 캔버스에 적용할 수 있어요.
              </p>

              {/* 이미지 업로드 */}
              <div className="adv-upload-zone" onClick={() => advFileRef.current?.click()}>
                {advPreview ? (
                  <img src={advPreview} alt="preview" style={{ width: "100%", maxHeight: 120, objectFit: "contain", borderRadius: 6 }} />
                ) : (
                  <>
                    <svg width="28" height="28" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 6 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>이미지를 클릭해서 선택하세요</p>
                    <p style={{ fontSize: 10, color: "#ccc", margin: "4px 0 0" }}>JPG, PNG, WEBP</p>
                  </>
                )}
                <input ref={advFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAdvFileChange} />
              </div>

              {advPreview && (
                <button style={{ marginTop: 6, fontSize: 11, color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                  onClick={() => advFileRef.current?.click()}>
                  다른 이미지 선택
                </button>
              )}

              {/* 공격 설정 */}
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#666", fontWeight: 600, display: "block", marginBottom: 4 }}>공격 기법</label>
                  <select className="adv-select" value={advAttackType} onChange={(e) => setAdvAttackType(e.target.value as "fgsm" | "pgd")}>
                    <option value="fgsm">FGSM (빠름)</option>
                    <option value="pgd">PGD (정밀, 느림)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#666", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    강도 (epsilon): <span style={{ color: "#e8541e" }}>{advEpsilon.toFixed(3)}</span>
                  </label>
                  <input type="range" min={0.005} max={0.1} step={0.005} value={advEpsilon}
                    onChange={(e) => setAdvEpsilon(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#e8541e" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#ccc" }}>
                    <span>미세 (0.005)</span><span>강렬 (0.1)</span>
                  </div>
                </div>
                {advAttackType === "pgd" && (
                  <div>
                    <label style={{ fontSize: 11, color: "#666", fontWeight: 600, display: "block", marginBottom: 4 }}>PGD 스텝: {advSteps}</label>
                    <input type="range" min={1} max={50} step={1} value={advSteps}
                      onChange={(e) => setAdvSteps(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#e8541e" }} />
                  </div>
                )}
              </div>

              {/* 실행 버튼 */}
              <button className="adv-attack-btn" style={{ marginTop: 14 }} disabled={!advFile || advLoading} onClick={handleAdvAttack}>
                {advLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span className="spinner" /> 변환 중...
                  </span>
                ) : "적대적 변환 실행"}
              </button>

              {/* 오류 */}
              {advError && (
                <div style={{ marginTop: 10, background: "#fff5f5", border: "1px solid #fdd", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#c0392b" }}>
                  ⚠️ {advError}
                </div>
              )}

              {/* 결과 */}
              {advResult && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "#aaa", marginBottom: 4 }}>원본</p>
                      <img src={`data:image/png;base64,${advResult.original.image}`} alt="original"
                        style={{ width: "100%", borderRadius: 6, border: "1px solid #eee" }} />
                      <p style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.3 }}>{advResult.original.label}<br/>{(advResult.original.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "#aaa", marginBottom: 4 }}>변환 결과</p>
                      <img src={`data:image/png;base64,${advResult.adversarial.image}`} alt="adversarial"
                        style={{ width: "100%", borderRadius: 6, border: "1px solid #eee" }} />
                      <p style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.3 }}>{advResult.adversarial.label}<br/>{(advResult.adversarial.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* 성공 여부 */}
                  <div style={{ background: advResult.success ? "#f0fff4" : "#f5f5f5", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: advResult.success ? "#22a35a" : "#888", marginBottom: 10, textAlign: "center", fontWeight: 600 }}>
                    {advResult.success
                      ? `✅ 변환 성공: "${advResult.original.label}" → "${advResult.adversarial.label}"`
                      : `라벨 유지됨 — epsilon을 높여보세요`}
                  </div>

                  {/* 적용 버튼 */}
                  <button className="adv-apply-btn" onClick={() => handleAdvApply(advResult.adversarial.image)}>
                    변환된 이미지를 캔버스에 적용
                  </button>
                </div>
              )}
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