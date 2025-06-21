import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [currentBg, setCurrentBg] = useState(0);

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
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Xử lý redirect sau đăng nhập thành công
  const handleLoginRedirect = () => {
    const returnUrl = localStorage.getItem("returnUrl") || "/";
    localStorage.removeItem("returnUrl");
    navigate(returnUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = input;

    try {
      const usersRef = collection(db, "usersSignin");
      const q = query(
        usersRef,
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrors({ username: "Tài khoản không tồn tại", password: "" });
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        setErrors({
          username: "",
          password: "Tài khoản chưa xác minh email. Vui lòng kiểm tra hộp thư.",
        });
        return;
      }

      handleLoginRedirect(); // ✅ Điều hướng sau khi đăng nhập
    } catch {
      setErrors({ username: "", password: "Mật khẩu không đúng" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "usersSignin", user.uid);
      const q = await getDocs(
        query(collection(db, "usersSignin"), where("uid", "==", user.uid))
      );

      if (q.empty) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      handleLoginRedirect(); // ✅ Điều hướng sau đăng nhập Google
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
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

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder=" "
                value={input.username}
                onChange={handleChange}
                required
              />
              <label>Tài khoản</label>
              <span className="input-border"></span>
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder=" "
                value={input.password}
                onChange={handleChange}
                required
              />
              <label>Mật khẩu</label>
              <span className="input-border"></span>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="btn-login">
              ĐĂNG NHẬP NGAY{" "}
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
              <a href="/forgot-password">Quên mật khẩu?</a>
            </p>
            <p>
              Bạn là người mới? <a href="/signup">Đăng kí ngay</a>
            </p>
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
