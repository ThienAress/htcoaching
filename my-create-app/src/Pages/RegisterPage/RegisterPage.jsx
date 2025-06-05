import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RegisterPage.css";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import ChatIcon from "../../components/ChatIcons/ChatIcons";

function RegisterPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    // ✅ Họ tên: ít nhất 8 ký tự
    if (!formData.name.trim() || formData.name.length < 8) {
      newErrors.name = "Họ và tên phải có ít nhất 8 ký tự";
    }
    // ✅ Số điện thoại: đúng 10 chữ số
    if (!formData.phone.match(/^[0-9]{10}$/)) {
      newErrors.phone = "Số điện thoại phải đúng 10 chữ số";
    }
    // ✅ Email: đúng định dạng @gmail.com
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      newErrors.email = "Email phải đúng định dạng @gmail.com";
    }

    // ✅ Thông tin bổ sung: ít nhất 8 ký tự
    if (!formData.note.trim() || formData.note.length < 8) {
      newErrors.note = "Thông tin bổ sung phải có ít nhất 8 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    navigate("/payment", {
      state: {
        formData,
        selectedPackage,
      },
    });
  };

  if (!selectedPackage) return <p>Không có gói tập nào được chọn.</p>;

  return (
    <>
      <HeaderMinimal />
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>THÔNG TIN THANH TOÁN</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Họ và tên *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label>Số điện thoại *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const input = e.target.value;
                if (/^[0-9]*$/.test(input)) {
                  setFormData({ ...formData, phone: input });
                }
              }}
              maxLength={10}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label>Thông tin bổ sung</label>
            <textarea
              rows={4}
              placeholder="Ghi chú bắt buộc (ví dụ thời gian tập, địa điểm mong muốn, để lại link fb or zalo để bên mình tiện trao đổi nha...)"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
            {errors.note && <span className="error">{errors.note}</span>}
            <button type="submit" className="order-button">
              ĐẶT HÀNG
            </button>
          </form>
        </div>

        <div className="checkout-right">
          <h3>ĐƠN HÀNG CỦA BẠN</h3>
          <div className="order-summary">
            <p>
              Sản phẩm: <strong>{selectedPackage.title}</strong>
            </p>
            <p>Tạm tính: {selectedPackage.price}</p>
            <hr />
            <p>
              <strong>Tổng cộng: {selectedPackage.price}</strong>
            </p>
            <p>Thanh toán chuyển khoản</p>
          </div>
          <p className="note">
            Thông tin của bạn sẽ được dùng để xử lý đơn hàng theo chính sách bảo
            mật của chúng tôi.
          </p>
        </div>
      </div>

      {/* Chat Icons */}
      <ChatIcon />

      {/* FooterMinimal */}
      <FooterMinimal />
    </>
  );
}

export default RegisterPage;
