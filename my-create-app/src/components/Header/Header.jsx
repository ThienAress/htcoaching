import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import User from "../../Pages/User/User";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-section">
        <Link to="/" className="logo">
          <img src="/images/logo.svg" alt="HT Coaching" />
        </Link>

        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#about">Giới thiệu</a>
            </li>
            <li>
              <a href="#trainers">Huấn luyện viên</a>
            </li>
            <li>
              <a href="#customer">Feedback</a>
            </li>
            <li>
              <a href="#classes">Chương trình đào tạo</a>
            </li>
            <li>
              <a href="#pricing">Gói tập</a>
            </li>
            <li>
              <a href="#contact">Liên hệ</a>
            </li>
            <li>
              <Link to="/club">CLB</Link>
            </li>
          </ul>
          {/* Hiển thị User component trong menu di động */}
          <div className="mobile-user">
            <User />
          </div>
        </nav>

        {/* Hiển thị User component ở chế độ desktop */}
        <div className="desktop-user">
          <User />
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
