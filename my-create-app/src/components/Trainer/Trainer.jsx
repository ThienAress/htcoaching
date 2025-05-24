import "./Trainer.css";
function Trainer() {
  return (
    <section className="trainers" id="trainers">
      <div className="container">
        <h2
          className="title trainers-title"
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          PERSONAL TRAINER
        </h2>
        <div
          className="trainer-photo"
          data-aos="flip-down"
          data-aos-duration="1000"
        >
          <img src="/images/class3.jpg" alt="Trainer" />
        </div>
        <div
          className="trainer-info"
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="100"
        >
          <h3>Hoàng Thiện (HTCOACHING)</h3>
          <h4>Chuyên gia huấn luyện cá nhân | 4+ năm kinh nghiệm</h4>
          <p>
            Mình sẽ giúp bạn xây dựng vóc dáng khoẻ mạnh và cải thiện thói quen
            sống thông qua phương pháp tập luyện
            <strong> khoa học, cá nhân hóa </strong> và dinh dưỡng{" "}
            <strong> tối ưu </strong>.
          </p>
          <div className="features">
            <div className="feature">
              <i className="fas fa-dumbbell"></i>Huấn luyện 1-1 (Online/Offline)
            </div>
            <div className="feature">
              <i className="fas fa-utensils"></i>Meal plan cá nhân hóa
            </div>
            <div className="feature">
              <i className="fas fa-chart-line"></i>Theo dõi tiến độ định kỳ
            </div>
            <div className="feature">
              <i className="fas fa-heartbeat"></i>Hỗ trợ phục hồi
            </div>
          </div>
          <a href="#contact" className="cta-button">
            <i className="fa-solid fa-arrow-right"></i> Liên hệ để nhận tư vấn
            miễn phí!
          </a>
        </div>
      </div>
    </section>
  );
}

export default Trainer;
