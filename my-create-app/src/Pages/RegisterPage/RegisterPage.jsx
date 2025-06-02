import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./RegisterPage.css";
import FooterMinimal from "../../components/Footer/FooterMinimal";

function RegisterPage() {
  const { state } = useLocation();
  const selectedPackage = state?.selectedPackage;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đặt hàng thành công!");
    console.log("Dữ liệu gửi:", formData, selectedPackage);
  };

  if (!selectedPackage) return <p>Không có gói tập nào được chọn.</p>;

  return (
    <>
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>THÔNG TIN THANH TOÁN</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Họ tên *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <label>Số điện thoại *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label>Thông tin bổ sung</label>
            <textarea
              rows={4}
              placeholder="Ghi chú nếu có (ví dụ thời gian tập, địa điểm mong muốn...)"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
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
          <button className="order-button " onClick={handleSubmit}>
            ĐẶT HÀNG
          </button>
          <p className="note">
            Thông tin của bạn sẽ được dùng để xử lý đơn hàng theo chính sách bảo
            mật của chúng tôi.
          </p>
        </div>
      </div>

      <FooterMinimal />
    </>
  );
}
export default RegisterPage;
