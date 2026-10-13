const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 10000;

// Proxy request bắt đầu bằng /api sang Backend Render
app.use('/api', createProxyMiddleware({
  target: 'https://mern-backend-s237717dd.onrender.com',
  changeOrigin: true,
}));

// Serve tĩnh build React
app.use(express.static(path.join(__dirname, 'dist'))); // hoặc 'build' tùy theo thư mục xuất ra của Vite/CRA

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));