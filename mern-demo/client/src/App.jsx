import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null); // Lưu ID sinh viên đang chọn để sửa

  const API_URL = '/api/students';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Không thể tải danh sách');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm đổ dữ liệu sinh viên vào Form khi nhấn nút "Sửa"
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // Hàm Hủy trạng thái sửa
  const handleCancel = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  // Xử lý Thêm mới (POST) hoặc Cập nhật (PUT - Câu 61)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !name || !email) return alert('Vui lòng điền đủ thông tin');

    try {
      let res;
      
      if (editingId) {
        // === CÂU 61: GỬI REQUEST PUT ĐỂ CẬP NHẬT SINH VIÊN ===
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, name, email }),
        });
      } else {
        // Thêm sinh viên mới (POST)
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, name, email }),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Thao tác thất bại: ${errorData.message || 'Lỗi dữ liệu'}`);
        return;
      }

      // Reset form sau khi gửi thành công
      setEditingId(null);
      setStudentId('');
      setName('');
      setEmail('');
      
      // Tải lại bảng để hiển thị thông tin mới cập nhật
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
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStudents();
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Form nhập thông tin sinh viên */}
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

      {/* Bảng danh sách sinh viên */}
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
              <td>{sv.email}</td>
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