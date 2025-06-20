import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [currentBg, setCurrentBg] = useState(0);
  const navigate = useNavigate();

  const backgrounds = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1950&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^.{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const usernameRegex = /^.{8,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;

    if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = "Họ và tên phải ít nhất 8 ký tự";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email phải là @gmail.com hợp lệ";
    }
    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Tài khoản phải ít nhất 8 ký tự";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Mật khẩu phải ít nhất 8 ký tự, có 1 chữ in hoa & 1 ký tự đặc biệt";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isUsernameTaken = async (username) => {
    const lowerUsername = username.toLowerCase();
    const q = query(
      collection(db, "usersSignin"),
      where("username", "==", lowerUsername)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const usernameExists = await isUsernameTaken(formData.username);
      if (usernameExists) {
        setErrors((prev) => ({
          ...prev,
          username: "Tài khoản đã tồn tại, vui lòng chọn tên khác",
        }));
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Gửi email xác minh
      await sendEmailVerification(userCredential.user);

      // Lưu thông tin vào Firestore
      await setDoc(doc(db, "usersSignin", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.fullName,
        username: formData.username.toLowerCase(),
        displayUsername: formData.username,
        email: formData.email,
        createdAt: new Date(),
      });

      alert(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác minh trước khi đăng nhập."
      );
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email đã tồn tại, vui lòng chuyển sang email khác.");
      } else {
        alert("Đăng ký thất bại: " + error.message);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-backgrounds">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`signup-bg ${index === currentBg ? "active" : ""}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>

      <div className="signup-overlay">
        <div className="signup-container">
          <header className="signup-header">
            <a href="/" className="logo-link">
              <img
                src="./images/logo.svg"
                alt="HT Coaching Logo"
                className="logo"
              />
            </a>
            <h1 className="signup-title">
              JOIN <span className="highlight">HTCOACHING</span>
            </h1>
            <p className="signup-subtitle">
              Start your fitness journey with us
            </p>
          </header>

          <form onSubmit={handleSubmit} className="signup-form">
            {[
              { id: "fullName", label: "Họ và tên", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "username", label: "Tài khoản", type: "text" },
              { id: "password", label: "Mật khẩu", type: "password" },
              {
                id: "confirmPassword",
                label: "Nhập lại mật khẩu",
                type: "password",
              },
            ].map((field) => (
              <div className="form-field" key={field.id}>
                <div className="input-container">
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    className={`form-input ${errors[field.id] ? "error" : ""}`}
                    placeholder=" "
                    autoComplete="off"
                    required
                  />
                  <label htmlFor={field.id} className="input-label">
                    {field.label}
                  </label>
                  <span className="input-border"></span>
                </div>
                {errors[field.id] && (
                  <p className="error-message">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <button type="submit" className="submit-button">
              ĐĂNG KÝ <i className="fas fa-arrow-right arrow-icon"></i>
            </button>
          </form>

          <footer className="signup-footer">
            <p className="login-link">
              Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
            <a href="/" className="home-link">
              <i className="fas fa-home"></i> Về trang chủ
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
