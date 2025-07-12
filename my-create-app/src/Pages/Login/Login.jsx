import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginRedirect = () => {
    const returnUrl = localStorage.getItem("returnUrl") || "/";
    localStorage.removeItem("returnUrl");
    navigate(returnUrl);
  };

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "usersSignin", user.uid);
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

      handleLoginRedirect();
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const backgrounds = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1950&q=80",
  ];

  const [currentBg, setCurrentBg] = useState(0);

  // Slide backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

          {/* Đăng nhập bằng Google */}
          <div className="social-login">
            <button
              className="social-btn google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <span className="icon">
                <i className="fab fa-google"></i>
              </span>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}
            </button>
          </div>

          <div className="login-footer">
            <a href="/" className="login-back">
              <i className="fa-solid fa-house"></i> Về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
