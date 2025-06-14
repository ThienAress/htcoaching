import { useState, useEffect } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }

      // Ngay khi cuộn là đổi background (scrollY > 0)
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-section">
        <a href="#" className="logo">
          <img src="./images/logo.svg" alt="htcoaching-logo" />
        </a>

        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          <ul>
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
            <li>
              <a href="/club" onClick={handleLinkClick}>
                CLB
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
    </header>
  );
}

export default Header;
