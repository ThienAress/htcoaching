import "./FooterMinimal.css";

const FooterMinimal = () => {
  return (
    <footer className="footer-minimal">
      <div className="container">
        <img src="/images/logo.svg" alt="Logo" className="footer-logo" />

        <p className="footer-slogan">
          "Không có body đỉnh trong vùng an toàn.
          <br /> Hoặc là thay đổi – hoặc là mãi như cũ."
        </p>

        <div className="footer-socials">
          <a
            href="https://www.facebook.com/thienvo123456"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>

        <p className="footer-contact">
          <i className="fas fa-phone-alt"></i> 0934.215.227 &nbsp;&nbsp;
          <i className="fas fa-envelope"></i> hoangthiengym99@gmail.com
        </p>
      </div>
    </footer>
  );
};

export default FooterMinimal;
