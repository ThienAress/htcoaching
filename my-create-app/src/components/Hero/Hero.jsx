import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "./Hero.css";

function Hero() {
  useEffect(() => {
    new Swiper(".hero-swiper", {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: "slide",
      speed: 1000,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    AOS.init({
      once: true,
      duration: 1000,
    });
  }, []);

  const slides = [
    {
      bgClass: "bg1",
    },
    {
      bgClass: "bg2",
    },
    {
      bgClass: "bg3",
    },
  ];

  return (
    <section id="home" className="hero">
      <div className="swiper hero-swiper">
        <div className="swiper-wrapper">
          {slides.map((slide, index) => (
            <div className="swiper-slide" key={index}>
              <div className="container">
                <div className={`hero-bg ${slide.bgClass}`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-content-container">
          <div className="hero-content">
            <h1
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration="1500"
            >
              <span>Tăng cơ - giảm mỡ</span>, <span>lột xác ngoạn mục</span>{" "}
              trong 90 ngày? Bạn đã sẵn sàng cùng tôi{" "}
              <span>chinh phục mục tiêu</span> này chưa!
            </h1>

            {/* Danh sách tính năng với Font Awesome icons */}
            <ul className="hero-features">
              <li
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="500"
                data-aos-delay="1000"
              >
                <i className="fas fa-route feature-icon"></i>
                Lộ trình riêng biệt
              </li>
              <li
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="500"
                data-aos-delay="1200"
              >
                <i className="fas fa-apple-alt feature-icon"></i>
                Thực đơn thông minh
              </li>
              <li
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="500"
                data-aos-delay="1400"
              >
                <i className="fas fa-chart-line feature-icon"></i>
                Theo dõi tiến độ dễ dàng trên Notion
              </li>
              <li
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="500"
                data-aos-delay="1600"
              >
                <i className="fas fa-medal feature-icon"></i>
                Cam kết đạt mục tiêu 100%
              </li>
            </ul>

            <div className="hero-buttons">
              <a
                href="#classes"
                className="btn btn-primary"
                data-aos="fade-right"
                data-aos-duration="500"
                data-aos-delay="1800"
                data-aos-easing="ease-in-sine"
              >
                <i className="fas fa-search mr-2"></i>
                Khám phá chương trình tập
              </a>
              <a
                href="#pricing"
                className="btn btn-secondary"
                data-aos="fade-left"
                data-aos-duration="500"
                data-aos-delay="1800"
                data-aos-easing="ease-in-sine"
              >
                <i className="fas fa-arrow-right mr-2"></i>
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>

        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </section>
  );
}

export default Hero;
