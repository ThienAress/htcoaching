import React, { useEffect, useRef } from "react";
import "./About.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import "swiper/css/pagination";
function About() {
  const statRef = useRef([]);

  useEffect(() => {
    AOS.init({ once: true });

    // Animate stats
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const targetValue = +stat.dataset.count;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.floor(progress * targetValue);
            stat.textContent = new Intl.NumberFormat().format(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              const index = statRef.current.indexOf(stat);
              const isFirstOrLast =
                index === 0 || index === statRef.current.length - 1;
              stat.textContent =
                new Intl.NumberFormat().format(targetValue) +
                (isFirstOrLast ? "+" : "");
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(stat);
        }
      });
    });

    statRef.current.forEach((stat) => observer.observe(stat));

    // Swiper init
    const aboutSwiper = new Swiper(".about-image-swiper", {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      effect: "slide",
      speed: 800,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 0 },
        768: { slidesPerView: 1, spaceBetween: 0 },
      },
    });

    aboutSwiper.on("slideChange", () => {
      if (typeof AOS !== "undefined") AOS.refresh();
    });

    // Full-height fix for mobile
    const setFullHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setFullHeight();
    window.addEventListener("resize", setFullHeight);
    window.addEventListener("load", setFullHeight);

    return () => {
      window.removeEventListener("resize", setFullHeight);
      window.removeEventListener("load", setFullHeight);
    };
  }, []);
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <h2
            className="title"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            NGƯỜI ĐỒNG HÀNH THAY ĐỔI CỦA BẠN
          </h2>

          <p
            className="quote"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            "Không có body đỉnh trong vùng an toàn. Hoặc là thay đổi – hoặc là
            mãi như cũ."
          </p>

          <p
            className="desc"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            Mình là <strong>Thiện</strong> – huấn luyện viên cá nhân chuyên
            nghiệp với hơn <strong>4 năm kinh nghiệm thực chiến</strong>, người
            đã trực tiếp thay đổi hình thể cho hơn <strong>50 học viên</strong>{" "}
            với đủ mọi thể trạng khác nhau. Tăng cơ – đốt mỡ – kỷ luật hơn mỗi
            ngày là những thứ bạn sẽ đạt được khi đồng hành cùng mình.
          </p>

          <div className="about-style">
            <h3
              data-aos="fade-right"
              data-aos-duration="500"
              data-aos-easing="ease-in-sine"
            >
              Phong cách huấn luyện
            </h3>
            <ul
              className="desc feature-list"
              data-aos="fade-right"
              data-aos-duration="500"
              data-aos-easing="ease-in-sine"
            >
              <li>
                <i className="fas fa-fire"></i> Máu lửa, kỷ luật, thân thiện,
                sát cánh trong từng buổi tập
              </li>
              <li>
                <i className="fas fa-bolt"></i> Động lực thực chất – Không tâng
                bốc, chỉ thẳng vào vấn đề bạn cần sửa
              </li>
              <li>
                <i className="fas fa-bullseye"></i> Lộ trình cá nhân hóa – Tập
                đúng kỹ thuật, ăn đúng cách, đánh trúng mục tiêu
              </li>
              <li>
                <i className="fas fa-dumbbell"></i> Với Sologan NO PAIN NO GAIN,
                mình sẽ đưa bạn vượt qua mọi giới hạn.
              </li>
            </ul>
          </div>

          <div
            className="about-stats"
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-easing="ease-in-sine"
          >
            {[50, 3, 4].map((value, index) => (
              <div className="stat-item" key={index}>
                <span
                  className="stat-number"
                  data-count={value}
                  ref={(el) => (statRef.current[index] = el)}
                >
                  0
                </span>
                <span className="stat-text">
                  {index === 0
                    ? "Học viên thay đổi ngoạn mục"
                    : index === 1
                    ? "Số lượng chuyên môn"
                    : "4 Năm kinh nghiệm đúc kết"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-image">
          <div className="swiper about-image-swiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <img src="/images/class1.jpg" alt="Phòng tập" />
              </div>
              <div className="swiper-slide">
                <img src="/images/class2.jpg" alt="Phòng tập" />
              </div>
              <div className="swiper-slide">
                <img src="/images/class3.jpg" alt="Phòng tập" />
              </div>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default About;
