import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const navigate = useNavigate();
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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      alert(`Chào mừng ${user.displayName}!`);
      navigate("/"); // chuyển về trang chủ
    } catch (error) {
      console.error("Google login failed:", error);
    }
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
              CHÀO BẠN ĐẾN VỚI <span>HTCOACHING</span>
            </h2>
            <p>Hãy đi đến giới hạn của bản thân cùng với mình</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`login-form ${isFocused ? "form-focused" : ""}`}
          >
            <div className="form-group">
              <input
                type="text"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
              />
              <label htmlFor="email">Tài khoản</label>
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
              <label htmlFor="password">Mật khẩu</label>
              <span className="input-border"></span>
            </div>

            <button type="submit" className="btn-login">
              GET STARTED
              <i className="fa-solid fa-arrow-right arrow-icon"></i>
            </button>
          </form>

          <div className="divider">
            <span>HOẶC</span>
          </div>

          <div className="social-login">
            <button className="social-btn google" onClick={handleGoogleLogin}>
              <span className="icon">
                <i className="fab fa-google"></i>
              </span>
              Đăng nhập bằng Google
            </button>
          </div>
          <div className="login-footer">
            <p>
              Bạn là người mới? <Link to="/signup">Đăng kí ngay</Link>
            </p>
            <a href="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </a>
            <Link to="/" className="login-back">
              <i className="fa-solid fa-house"></i>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
