import React, { useState, useEffect } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import ChatIcon from "../../components/ChatIcons/ChatIcons";
import {
  doc,
  setDoc,
  Timestamp,
  getDocs,
  query,
  collection,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const selectedPackage = state?.selectedPackage;
  const planMode = state?.planMode;
  const originalPrice = state?.originalPrice || 0;
  const discount = state?.discount || 0;
  const total = state?.total || originalPrice;

  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [countdownInterval, setCountdownInterval] = useState(null);

  // Xử lý tự động điền thông tin từ các nguồn khác nhau
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (state?.reuseInfo) {
        setFormData({
          uid: state.reuseInfo.uid || null,
          name: state.reuseInfo.name,
          phone: state.reuseInfo.phone,
          email: state.reuseInfo.email,
          location: state.reuseInfo.location,
          schedule: state.reuseInfo.schedule || [],
          note: state.reuseInfo.note || "",
        });
        setIsLoading(false);
        return;
      }

      if (state?.formData) {
        setFormData(state.formData);
        setIsLoading(false);
        return;
      }

      if (state?.phone) {
        try {
          const q = query(
            collection(db, "orders"),
            where("phone", "==", state.phone),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const order = snapshot.docs[0].data();
            setFormData({
              uid: order.uid,
              name: order.name,
              phone: order.phone,
              email: order.email,
              location: order.location,
              schedule: order.schedule,
              note: order.note || "",
            });
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [state]);

  useEffect(() => {
    if (!selectedPackage || !planMode) {
      navigate("/", { replace: true });
      return;
    }
  }, [selectedPackage, planMode, navigate]);

  useEffect(() => {
    if (showSuccess) {
      document.body.classList.add("popup-active");
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setCountdownInterval(interval);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      document.body.classList.remove("popup-active");
    };
  }, [showSuccess]);

  useEffect(() => {
    if (countdown === 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      navigate("/");
    }
  }, [countdown, countdownInterval, navigate]);

  const handleConfirmPayment = async () => {
    try {
      if (!formData) return;

      // Lấy uid user hiện tại từ Firebase Auth
      const auth = getAuth();
      const myUid = auth.currentUser?.uid || formData.uid || null;
      if (!myUid) {
        alert("Không xác định được tài khoản, vui lòng đăng nhập lại.");
        return;
      }

      const totalSessions = Number(selectedPackage.totalSessions) || 0;
      const newId = `don_hang_${Date.now()}`;
      await setDoc(doc(db, "orders", newId), {
        uid: myUid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        schedule: formData.schedule,
        note: formData.note,
        packageTitle: selectedPackage.title,
        planMode,
        originalPrice,
        discount,
        total,
        totalSessions: totalSessions,
        remainingSessions: totalSessions,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Lỗi khi ghi dữ liệu:", error);
      alert("Đã có lỗi khi xác nhận thanh toán.");
    }
  };

  if (isLoading || !formData || !selectedPackage || !planMode) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

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
              <strong>Số tiền:</strong> {total.toLocaleString()}đ
            </p>
            <p>
              <strong>Nội dung:</strong> {formData.name} +{" "}
              {selectedPackage.title}
            </p>
          </div>
          <div className="payment-instructions">
            <h3>Hướng dẫn thanh toán</h3>
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
            <p>
              <strong>Phòng tập:</strong> {formData.location}
            </p>
            <div>
              <strong>Lịch tập luyện:</strong>
              <ul>
                {formData.schedule.map((item, i) => (
                  <li key={i}>
                    {item.day} - {item.time}
                  </li>
                ))}
              </ul>
            </div>
            {formData.note && (
              <p>
                <strong>Ghi chú:</strong> {formData.note}
              </p>
            )}
          </div>

          <div className="order-details">
            <h4>Chi tiết đơn hàng</h4>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>Sản phẩm</strong>
                  </td>
                  <td className="text-right">
                    <strong>Tổng</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    {planMode} ({selectedPackage.title})
                  </td>
                  <td className="text-right">
                    {originalPrice.toLocaleString()}đ
                  </td>
                </tr>
                {discount > 0 && (
                  <tr>
                    <td>
                      <span className="payment-discount">Giảm giá 15%</span>
                    </td>
                    <td className="text-right payment-discount">
                      -{discount.toLocaleString()}đ
                    </td>
                  </tr>
                )}
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
                  <td className="text-right" style={{ fontWeight: "bold" }}>
                    {total.toLocaleString()}đ
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Số buổi tập:</strong>
                  </td>
                  <td className="text-right">
                    {selectedPackage.totalSessions} buổi
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
              Tư vấn viên sẽ liên hệ với mình trong thời gian sớm nhất
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
