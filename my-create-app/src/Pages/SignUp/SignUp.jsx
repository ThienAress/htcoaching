import React, { useState, useEffect } from "react";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isFocused, setIsFocused] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    console.log("Form data:", formData);
  };

  return (
    <div className="signup-fullscreen">
      <div className="bg-slideshow">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`bg-slide ${index === currentBg ? "active" : ""}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>

      <div className="signup-overlay">
        <div className="signup-container">
          <div className="signup-header">
            <a href="/">
              <img
                src="./images/logo.svg"
                alt="HT Coaching Logo"
                className="logo"
              />
            </a>
            <h2>
              JOIN <span>HTCOACHING</span>
            </h2>
            <p>Start your fitness journey with us</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`signup-form ${isFocused ? "form-focused" : ""}`}
          >
            <div className="form-group">
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder=" "
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="fullName">Họ và tên</label>
              <span className="input-border"></span>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="email">Email</label>
              <span className="input-border"></span>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="username">Tài khoản</label>
              <span className="input-border"></span>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="password">Mật khẩu</label>
              <span className="input-border"></span>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <span className="input-border"></span>
            </div>

            <button type="submit" className="btn-signup">
              ĐĂNG KÝ
              <i className="fa-solid fa-arrow-right arrow-icon"></i>
            </button>
          </form>

          <div className="divider">
            <span>HOẶC</span>
          </div>

          <div className="social-signup">
            <button className="social-btn google">
              <span className="icon">
                <i className="fab fa-google"></i>
              </span>
              Continue with Google
            </button>
            <button className="social-btn facebook">
              <span className="icon">
                <i className="fab fa-facebook-f"></i>
              </span>
              Continue with Facebook
            </button>
          </div>

          <div className="signup-footer">
            <p>
              Already a member? <a href="/login">Login now</a>
            </p>
            <a href="/" className="signup-back">
              <i className="fa-solid fa-house"></i>
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
