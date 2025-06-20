import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "✅ Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư!"
      );
    } catch (error) {
      setMessage("❌ Lỗi: " + error.message);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Quên mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Gửi email khôi phục</button>
      {message && <p>{message}</p>}

      <button
        className="back-to-login"
        onClick={() => navigate("/login")}
        style={{ marginTop: "16px" }}
      >
        <i className="fas fa-arrow-left"></i>
        Quay lại đăng nhập
      </button>
    </div>
  );
};

export default ForgotPassword;
