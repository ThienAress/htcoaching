function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content">
          <h2 className="section-title">Liên hệ với chúng tôi</h2>
          <p>Để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí cho bạn</p>

          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Họ và tên" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Số điện thoại" required />
            </div>
            <div className="form-group">
              <select required>
                <option value="" disabled selected>
                  Chọn gói tập quan tâm
                </option>
                <option value="basic">Gói cơ bản</option>
                <option value="advanced">Gói nâng cao</option>
                <option value="vip">Gói VIP</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Gửi thông tin
            </button>
          </form>
        </div>

        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>123 Đường ABC, Quận 1, TP.HCM</p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone-alt"></i>
            <p>0901.234.567</p>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <p>info@elitefitness.com</p>
          </div>
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <p>Thứ 2 - Chủ nhật: 6:00 - 22:00</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Contact;
