const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Chuỗi kết nối MongoDB Atlas
const mongoURI = "mongodb+srv://admin:KimCuong2026Db@cluster0.gsryspa.mongodb.net/mern-demo?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('Ket noi MongoDB Atlas thanh cong!'))
  .catch((err) => console.error('Loi ket noi MongoDB:', err));

const Student = require('./models/Student');

// 1. API Lấy danh sách sinh viên (GET)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. API Thêm sinh viên mới (POST - Câu 49)
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const newStudent = new Student({ studentId, name, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. API Cập nhật sinh viên (PUT - Câu 61)
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, name, email } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { studentId, name, email },
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. API Xóa sinh viên (DELETE - Câu 62)
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.json({ message: 'Xóa sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});