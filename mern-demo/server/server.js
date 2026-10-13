const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Quản Lý Sinh Viên đang hoạt động!');
});

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

const Student = require('./models/Student');

// GET: Lấy danh sách
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error('Lỗi lấy danh sách:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST: Thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ MSSV và Họ tên'
      });
    }

    const finalEmail = (email && email.trim() !== '') ? email.trim() : `${studentId.trim()}@student.edu.vn`;

    const newStudent = new Student({ 
      studentId: studentId.trim(), 
      name: name.trim(), 
      email: finalEmail 
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    console.error('Lỗi thêm sinh viên:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT: Cập nhật
app.put('/api/students/:id', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, name, email },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error('Lỗi cập nhật:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Xóa
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    res.status(200).json({ message: 'Xóa sinh viên thành công' });
  } catch (err) {
    console.error('Lỗi xóa:', err.message);
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});