import React, { useState, useEffect } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import ChatIcon from "../../components/ChatIcons/ChatIcons";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../UserContent/UserContext";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const formData = state?.formData;
  const selectedPackage = state?.selectedPackage;
  const planMode = state?.planMode;

  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập để tiếp tục.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (showSuccess) {
      document.body.classList.add("popup-active");

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            navigate("/");
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
        document.body.classList.remove("popup-active");
      };
    }
  }, [showSuccess]);

  if (!formData || !selectedPackage || !planMode) {
    return <p>Thiếu thông tin thanh toán hoặc gói tập.</p>;
  }

  const handleConfirmPayment = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const snapshot = await getDocs(ordersRef);
      const donHangCount = snapshot.size;
      const newId = `don_hang_${donHangCount + 1}`;

      await setDoc(doc(db, "orders", newId), {
        uid: user?.uid || null,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        note: formData.note,
        packageTitle: selectedPackage.title,
        packagePrice: selectedPackage.price,
        planMode: planMode,
        timestamp: Timestamp.now(),
        status: "pending",
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Lỗi khi ghi dữ liệu:", error);
      alert("Đã có lỗi khi xác nhận thanh toán.");
    }
  };

  return (
    <>
      <HeaderMinimal />
      <div className="payment-container container">
        <div className="payment-left">
          <h2>QUÉT QR THANH TOÁN</h2>
          <img
            src="/images/qrCode.jpg"
            alt="QR Thanh toán Vietcombank"
            className="qr-image"
          />
          <div className="bank-info">
            <h4>THÔNG TIN CHUYỂN KHOẢN</h4>
            <p>Hỗ trợ Ví điện tử MoMo/ZaloPay</p>
            <p>Hoặc ứng dụng ngân hàng để chuyển khoản nhanh 24/7</p>
            <p>
              <strong>Tên tài khoản:</strong> Võ Hoàng Thiện
            </p>
            <p>
              <strong>Ngân hàng:</strong> Tpbank
            </p>
            <p>
              <strong>Số tài khoản:</strong> 10001167831
            </p>
            <p>
              <strong>Số tiền:</strong> {selectedPackage.price}
            </p>
            <p>
              <strong>Nội dung:</strong> {formData.name} + {planMode} (
              {selectedPackage.title})
            </p>
          </div>

          <div className="payment-instructions">
            <h3>HƯỚNG DẪN THANH TOÁN</h3>
            <ul>
              <li>
                <strong>Bước 1:</strong> Mở ví điện tử/Ngân hàng
              </li>
              <li>
                <strong>Bước 2:</strong> Quét mã QR
              </li>
              <li>
                <strong>Bước 3:</strong> Ghi đúng nội dung chuyển khoản
              </li>
              <li>
                <strong>Bước 4:</strong> Chụp màn hình chuyển khoản thành công
              </li>
            </ul>
            <p>
              Vui lòng ghi đúng nội dung và đợi tư vấn viên xác nhận trong ít
              phút!
            </p>
          </div>
        </div>

        <div className="payment-right">
          <h2>THÔNG TIN KHÁCH HÀNG</h2>
          <div className="info-block">
            <p>
              <strong>Họ tên:</strong> {formData.name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {formData.phone}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            {formData.note && (
              <p>
                <strong>Ghi chú:</strong> {formData.note}
              </p>
            )}
          </div>

          <div className="order-details">
            <h4>CHI TIẾT ĐƠN HÀNG</h4>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>SẢN PHẨM</strong>
                  </td>
                  <td className="text-right">
                    <strong>TỔNG</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    {planMode} ({selectedPackage.title})
                  </td>
                  <td className="text-right">{selectedPackage.price}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Phương thức thanh toán:</strong>
                  </td>
                  <td className="text-right">Chuyển khoản</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tổng cộng:</strong>
                  </td>
                  <td className="text-right">
                    <strong>{selectedPackage.price}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="btn-confirm" onClick={handleConfirmPayment}>
            Xác nhận đã thanh toán
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>
              <i className="fa-solid fa-check"></i> Cảm ơn bạn đã đặt hàng thành
              công!
            </h3>
            <p>
              Tư vấn viên sẽ liên hệ với bạn trong thời gian sớm nhất.
              <br />
              Hệ thống sẽ tự động quay về trang chủ trong:{" "}
              <strong>{countdown}s</strong>.
            </p>
          </div>
        </div>
      )}

      <ChatIcon />
      <FooterMinimal />
    </>
  );
}

export default PaymentPage;
