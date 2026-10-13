import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Khai báo chính xác domain Backend
  const BACKEND_URL = 'https://mern-backend-s237717dd.onrender.com';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/students`);
      if (!res.ok) throw new Error(`Mã lỗi HTTP: ${res.status}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Đổ dữ liệu vào Form khi nhấn "Sửa"
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId || '');
    setName(student.name || '');
    setEmail(student.email || '');
  };

  // Hủy sửa
  const handleCancel = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  // Thêm mới (POST) hoặc Cập nhật (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !name) return alert('Vui lòng điền đủ MSSV và Họ tên');

    try {
      let res;
      const payload = { 
        studentId: studentId.trim(), 
        name: name.trim(), 
        email: email.trim() || `${studentId}@student.edu.vn`
      };

      if (editingId) {
        // Request PUT: https://mern-backend-s237717dd.onrender.com/api/students/:id
        res = await fetch(`${BACKEND_URL}/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Request POST: https://mern-backend-s237717dd.onrender.com/api/students
        res = await fetch(`${BACKEND_URL}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Chi tiết lỗi từ Backend:", responseData);
        alert(`Thao tác thất bại: ${responseData.message || responseData.error || 'Lỗi dữ liệu từ Backend'}`);
        return;
      }

      // Reset form sau khi gửi thành công
      handleCancel();
      fetchStudents(); 
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Lỗi kết nối tới Server!");
    }
  };

  // Xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStudents();
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Form nhập thông tin */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: '5px 15px', 
            backgroundColor: editingId ? '#2196F3' : '#4CAF50', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} style={{ marginLeft: '10px', padding: '5px 15px' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Bảng danh sách */}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email || 'Chưa cập nhật'}</td>
              <td>
                <button 
                  onClick={() => handleEdit(sv)} 
                  style={{ padding: '3px 8px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer', marginRight: '5px' }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(sv._id)} 
                  style={{ padding: '3px 8px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;