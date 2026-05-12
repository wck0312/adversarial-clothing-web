require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
