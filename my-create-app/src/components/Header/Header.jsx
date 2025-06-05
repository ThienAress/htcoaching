import { useState, useEffect } from "react";

import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Đóng menu khi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // Đóng menu khi click vào link
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <a href="#" className="logo">
          <img src="./images/logo.svg" alt="htcoaching logo" />
        </a>
        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#home" onClick={handleLinkClick}>
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#about" onClick={handleLinkClick}>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#trainers" onClick={handleLinkClick}>
                Huấn luyện viên
              </a>
            </li>
            <li>
              <a href="#customer" onClick={handleLinkClick}>
                Feedback
              </a>
            </li>
            <li>
              <a href="#classes" onClick={handleLinkClick}>
                Chương trình đào tạo
              </a>
            </li>
            <li>
              <a href="#pricing" onClick={handleLinkClick}>
                Gói tập
              </a>
            </li>
            <li>
              <a href="#contact" onClick={handleLinkClick}>
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>
        <div className="nav-cta">
          <a href="#pricing" className="btn btn-primary">
            Đăng ký ngay
          </a>
        </div>
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fas fa-bars"></i>
        </div>
      </div>

      <div></div>
    </header>
  );
}

export default Header;
