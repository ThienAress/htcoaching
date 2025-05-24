import "./Footer.css";
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-about">
            <img
              src="images/logo.svg"
              alt="Elite Fitness"
              className="footer-logo"
            />
            <p>
              Elite Fitness - Phòng tập cao cấp với tiêu chuẩn 5 sao, mang đến
              cho bạn trải nghiệm tập luyện tốt nhất.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/thienvo123456">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Liên kết nhanh</h3>
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
          </div>

          <div className="footer-links">
            <h3>Chương trình đào tạo</h3>
            <ul>
              <li>
                <a href="#">Personal Training</a>
              </li>
              <li>
                <a href="#">Cardio & HIIT</a>
              </li>
              <li>
                <a href="#">Boxing</a>
              </li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3>Đăng ký nhận tin</h3>
            <p>Nhận ưu đãi và thông tin mới nhất từ chúng tôi</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Email của bạn" required />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025 HTCOACHING</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
