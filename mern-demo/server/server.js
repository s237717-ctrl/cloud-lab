const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra server
app.get('/', (req, res) => {
  res.send('Backend Quản Lý Sinh Viên đang hoạt động!');
});

// Kết nối MongoDB Atlas
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Lỗi: Chưa cấu hình biến môi trường MONGODB_URI');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Kết nối MongoDB Atlas thành công!');
    })
    .catch((err) => {
      console.error('Lỗi kết nối MongoDB:', err.message);
    });
}

// Model sinh viên
const Student = require('./models/Student');

// GET: Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error('Lỗi lấy danh sách sinh viên:', err.message);
    res.status(500).json({ message: 'Không thể lấy danh sách sinh viên' });
  }
});

// POST: Thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ MSSV, họ tên và email'
      });
    }

    const newStudent = new Student({ studentId, name, email });
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error('Lỗi thêm sinh viên:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT: Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, name, email },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error('Lỗi cập nhật sinh viên:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.status(200).json({
      message: 'Xóa sinh viên thành công'
    });
  } catch (err) {
    console.error('Lỗi xóa sinh viên:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Khởi động server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});