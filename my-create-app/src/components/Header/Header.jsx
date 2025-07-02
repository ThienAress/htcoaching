import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import User from "../../Pages/User/User";
import "./Header.css";
import { useAdminCheck } from "../../hook/useAdminCheck";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const { isAdmin, loading } = useAdminCheck();
  if (loading) return null;
  return (
    <header
      ref={headerRef}
      className={`header ${isScrolled ? "scrolled" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="header-section">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src="/images/logo.svg" alt="HT Coaching" />
        </Link>

        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="/" onClick={() => setMenuOpen(false)}>
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#trainers" onClick={() => setMenuOpen(false)}>
                Huấn luyện viên
              </a>
            </li>
            <li>
              <a href="#customer" onClick={() => setMenuOpen(false)}>
                Feedback
              </a>
            </li>
            <li>
              <a href="#classes" onClick={() => setMenuOpen(false)}>
                Chương trình đào tạo
              </a>
            </li>
            <li>
              <a href="#pricing" onClick={() => setMenuOpen(false)}>
                Gói tập
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Liên hệ
              </a>
            </li>
            <li>
              <Link to="/club" onClick={() => setMenuOpen(false)}>
                CLB
              </Link>
            </li>

            {/* ✅ Chỉ admin mới thấy mục quản trị */}
            {isAdmin && (
              <li>
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Quản trị
                </Link>
              </li>
            )}
          </ul>
          <div className="mobile-user">
            <User onToggle={() => setMenuOpen(false)} />
          </div>
        </nav>
        <div className="desktop-user">
          <User />
        </div>
        <div
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
        >
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
