import React, { useState, useEffect } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-fullscreen">
      <div className="bg-slideshow">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`bg-slide ${index === currentBg ? "active" : ""}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>

      <div className="login-overlay">
        <div className="login-container">
          <div className="login-header">
            <a href="/">
              <img
                src="./images/logo.svg"
                alt="HT Coaching Logo"
                className="logo"
              />
            </a>
            <h2>
              WELCOME TO <span>HTCOACHING</span>
            </h2>
            <p>Push your limits with us</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`login-form ${isFocused ? "form-focused" : ""}`}
          >
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="email">Email</label>
              <span className="input-border"></span>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="password">Password</label>
              <span className="input-border"></span>
            </div>

            <button type="submit" className="btn-login">
              GET STARTED
              <span className="arrow-icon">→</span>
            </button>
          </form>

          <div className="divider">
            <span>HOẶC</span>
          </div>

          <div className="social-login">
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

          <div className="login-footer">
            <p>
              New member? <a href="/signup">Sign up now</a>
            </p>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
            <a href="/" className="login-back">
              <i class="fa-solid fa-house"></i>
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
