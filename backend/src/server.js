require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// 테스트용 기본 주소
app.get('/', (req, res) => {
  res.send('Server running');
});

// auth 라우트 연결
app.use('/api/auth', authRoutes);

// 포트 실행
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});