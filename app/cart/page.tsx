"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

type CartItem = {
  id: number;
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  created_at: string;
};

function CartContent() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: { "user-id": String(user.id) },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleDelete = async (id: number) => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
        method: "DELETE",
        headers: { "user-id": String(user.id) },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .step-item { display: flex; align-items: center; gap: 6px; font-size: 13px; }
        .step-item.active { font-weight: 700; color: #111; }
        .step-item.inactive { color: #bbb; }
        .delete-btn { background: none; border: 1px solid #e0e0e0; border-radius: 4px; padding: 4px 10px; font-size: 12px; color: #888; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .delete-btn:hover { border-color: #e8541e; color: #e8541e; }
        .order-btn { width: 100%; height: 52px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .order-btn:hover { background: #333; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 80px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, letterSpacing: "-0.5px" }}>장바구니</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}>
          <span className="step-item active">장바구니</span>
          <span style={{ color: "#ccc", fontSize: 13 }}>›</span>
          <span className="step-item inactive">주문서 작성</span>
          <span style={{ color: "#ccc", fontSize: 13 }}>›</span>
          <span className="step-item inactive">주문 완료</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>불러오는 중...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>장바구니에 담은 상품이 없어요.</p>
            <p style={{ fontSize: 14, color: "#888" }}>비어있는 장바구니를 채워주세요!</p>
            <Link href="/" style={{ display: "inline-block", marginTop: 28, background: "#111", color: "#fff", borderRadius: 8, padding: "12px 32px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            {/* 상품 목록 */}
            <div style={{ flex: 1 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 72, height: 72, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="/images/tshirt-front.png" alt="" style={{ width: 56, height: 56, objectFit: "contain" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.product_name}</p>
                      <p style={{ fontSize: 12, color: "#888" }}>{item.color} / {item.size} / {item.quantity}개</p>
                      <p style={{ fontSize: 14, fontWeight: 800, marginTop: 6 }}>{item.price.toLocaleString()}원</p>
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>삭제</button>
                </div>
              ))}
            </div>

            {/* 결제 요약 */}
            <div style={{ width: 280, background: "#f9f9f9", borderRadius: 12, padding: "24px 20px", flexShrink: 0, position: "sticky", top: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>주문 요약</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: "#555" }}>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 14 }}>
                <span style={{ color: "#555" }}>배송비</span>
                <span>무료</span>
              </div>
              <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 16, display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>총 결제 금액</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#e8541e" }}>{totalPrice.toLocaleString()}원</span>
              </div>
              <button className="order-btn">주문하기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}
