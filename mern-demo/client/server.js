const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Reverse Proxy chuyển tiếp request tới Backend Render
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://mern-backend-kimcuong29.onrender.com',
    changeOrigin: true,
    // Tự động điều hướng /api/students sang /students nếu Backend không dùng tiền tố /api
    pathRewrite: (path, req) => {
      // Nếu Backend của bạn dùng /students thay vì /api/students, bỏ comment dòng dưới:
      // return path.replace(/^\/api/, '');
      return path;
    },
    onProxyReq: (proxyReq, req) => {
      // Đảm bảo ghi lại Body Data khi thực hiện POST/PUT qua Proxy
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);

// Trả về file tĩnh từ thư mục dist (React/Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend Reverse Proxy Server running on port ${PORT}`);
});