function About() {
  return (
    <section id="about" class="about">
      <div class="container">
        <div class="about-content">
          <h2
            class="title"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            NGƯỜI ĐỒNG HÀNH THAY ĐỔI CỦA BẠN
          </h2>

          <p
            class="quote"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            "Không có body đỉnh trong vùng an toàn. Hoặc là thay đổi – hoặc là
            mãi như cũ."
          </p>

          <p
            class="desc"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            Mình là <strong>Thiện</strong> – huấn luyện viên cá nhân chuyên
            nghiệp với hơn <strong>4 năm kinh nghiệm thực chiến</strong>, người
            đã trực tiếp thay đổi hình thể cho hơn
            <strong>50 học viên</strong> với đủ mọi thể trạng khác nhau. Tăng cơ
            – đốt mỡ – kỷ luật hơn mỗi ngày là những thứ bạn sẽ đạt được khi
            đồng hành cùng mình.
          </p>
          <div class="about-style">
            <h3
              data-aos="fade-right"
              data-aos-duration="500"
              data-aos-easing="ease-in-sine"
            >
              Phong cách huấn luyện
            </h3>
            <ul
              class="desc feature-list"
              data-aos="fade-right"
              data-aos-duration="500"
              data-aos-easing="ease-in-sine"
            >
              <li>
                <i class="fas fa-fire"></i> Máu lửa, kỷ luật, thân thiện, sát
                cánh trong từng buổi tập
              </li>
              <li>
                <i class="fas fa-bolt"></i> Động lực thực chất – Không tâng bốc,
                chỉ thẳng vào vấn đề bạn cần sửa
              </li>
              <li>
                <i class="fas fa-bullseye"></i> Lộ trình cá nhân hóa – Tập đúng
                kỹ thuật, ăn đúng cách, đánh trúng mục tiêu
              </li>
              <li>
                <i class="fas fa-dumbbell"></i>
                Với Sologan NO PAIN NO GAIN, mình sẽ đưa bạn vượt qua mọi giới
                hạn.
              </li>
            </ul>
          </div>

          <div
            class="about-stats"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            <div class="stat-item">
              <span class="stat-number" data-count="50">
                0
              </span>
              <span class="stat-text">Học viên thay đổi ngoạn mục</span>
            </div>
            <div class="stat-item">
              <span class="stat-number" data-count="3">
                0
              </span>
              <span class="stat-text">Số lượng chuyên môn</span>
            </div>
            <div class="stat-item">
              <span class="stat-number" data-count="4">
                0
              </span>
              <span class="stat-text">4 Năm kinh nghiệm đúc kết</span>
            </div>
          </div>
        </div>

        <div class="about-image">
          <div class="swiper about-image-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <img src="./assets/images/class1.jpg" alt="Phòng tập" />
              </div>
              <div class="swiper-slide">
                <img src="./assets/images/hero2.jpg" alt="HLV" />
              </div>
              <div class="swiper-slide">
                <img src="./assets/images/hero.jpg" alt="Thiết bị" />
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default About;
