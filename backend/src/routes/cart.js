const express = require("express");
const router = express.Router();
const db = require("../db");

// 장바구니 목록 조회
router.get("/", async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(401).json({ message: "로그인이 필요합니다." });
  try {
    const [rows] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 장바구니 추가
router.post("/", async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(401).json({ message: "로그인이 필요합니다." });
  const { product_name, color, size, quantity, price } = req.body;
  try {
    await db.query(
      "INSERT INTO cart (user_id, product_name, color, size, quantity, price) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, product_name, color, size, quantity, price]
    );
    res.json({ message: "장바구니에 추가되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 장바구니 항목 삭제
router.delete("/:id", async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(401).json({ message: "로그인이 필요합니다." });
  try {
    await db.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [
      req.params.id,
      userId,
    ]);
    res.json({ message: "삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
