import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "usersSignin", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        createdAt: new Date(),
      });

      navigate("/login");
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    }
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
            autoComplete="off"
            className="signup-form"
          >
            {[
              "fullName",
              "email",
              "username",
              "password",
              "confirmPassword",
            ].map((field) => (
              <div className="form-group" key={field}>
                <input
                  type={
                    field.toLowerCase().includes("password")
                      ? "password"
                      : "text"
                  }
                  name={field}
                  placeholder=" "
                  autoComplete="off"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                <label htmlFor={field}>
                  {
                    {
                      fullName: "Họ và tên",
                      email: "Email",
                      username: "Tài khoản",
                      password: "Mật khẩu",
                      confirmPassword: "Nhập lại mật khẩu",
                    }[field]
                  }
                </label>
                <span className="input-border"></span>
                {errors[field] && <p className="error-msg">{errors[field]}</p>}
              </div>
            ))}

            <button type="submit" className="btn-signup">
              ĐĂNG KÝ <i className="fa-solid fa-arrow-right arrow-icon"></i>
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
            <a href="/" className="signup-back">
              <i className="fa-solid fa-house"></i> Về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
