import "./Header.css";
function Header() {
  return (
    <header className="header">
      <div className="container">
        <a href="#" className="logo">
          <img src="/images/logo.svg" alt="HTCOACHING Logo" />
        </a>
        <nav className="navbar" id="navbar">
          <ul>
            <li>
              <a href="#home">Trang chủ</a>
            </li>
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
          </ul>
        </nav>
        <div className="nav-cta">
          <a href="#pricing" className="btn">
            Đăng ký ngay
          </a>
        </div>
        <div className="menu-toggle" id="menu-toggle">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </header>
  );
}
export default Header;
