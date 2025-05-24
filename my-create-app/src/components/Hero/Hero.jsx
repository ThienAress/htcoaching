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
  return (
    <section id="home" className="hero">
      <div className="swiper hero-swiper">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="container">
              <div className="hero-bg bg1"></div>
              <div className="hero-content">
                <h1
                  data-aos="fade-down"
                  data-aos-easing="linear"
                  data-aos-duration="1500"
                >
                  Thay đổi cơ thể trong 90 ngày
                </h1>
                <p
                  data-aos="fade-down"
                  data-aos-easing="linear"
                  data-aos-duration="500"
                  data-aos-delay="1000"
                >
                  Phòng tập 5 sao với trang thiết bị hiện đại và huấn luyện viên
                  chuyên nghiệp
                </p>
                <div className="hero-buttons">
                  <a
                    href="#classes"
                    className="btn btn-primary"
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="1500"
                    data-aos-easing="ease-in-sine"
                  >
                    Khám phá chương trình tập
                  </a>
                  <a
                    href="#pricing"
                    className="btn btn-secondary"
                    data-aos="fade-left"
                    data-aos-duration="500"
                    data-aos-delay="1500"
                    data-aos-easing="ease-in-sine"
                  >
                    Đăng ký ngay
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="swiper-slide">
            <div className="container">
              <div className="hero-bg bg2"></div>
              <div className="hero-content">
                <h1
                  data-aos="fade-down"
                  data-aos-easing="linear"
                  data-aos-duration="1500"
                >
                  Bạn muốn tăng cơ - giảm mỡ
                </h1>
                <p
                  data-aos="fade-down"
                  data-aos-easing="linear"
                  data-aos-duration="500"
                  data-aos-delay="1000"
                >
                  Chương trình tập luyện cá nhân hóa cùng chuyên gia dinh dưỡng
                </p>
                <div className="hero-buttons">
                  <a
                    href="#classes"
                    className="btn btn-primary"
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="1500"
                    data-aos-easing="ease-in-sine"
                  >
                    Khám phá chương trình tập
                  </a>
                  <a
                    href="#pricing"
                    className="btn btn-secondary"
                    data-aos="fade-left"
                    data-aos-duration="500"
                    data-aos-delay="1500"
                    data-aos-easing="ease-in-sine"
                  >
                    Đăng ký ngay
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="swiper-slide">
            <div className="container">
              <div className="hero-bg bg3"></div>
              <div className="hero-content">
                <h1
                  data-aos="fade-down"
                  data-aos-easing="linear"
                  data-aos-duration="1500"
                >
                  Tăng thể lực toàn diện khi tham gia lớp BOXING
                </h1>
                <p
                  data-aos="fade-down"
                  data-aos-easing="linear"
                  data-aos-duration="500"
                  data-aos-delay="1000"
                >
                  Chương trình tập luyện cá nhân hóa cùng chuyên gia dinh dưỡng
                </p>
                <div className="hero-buttons">
                  <a
                    href="#classes"
                    className="btn btn-primary"
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="1500"
                    data-aos-easing="ease-in-sine"
                  >
                    Khám phá chương trình tập
                  </a>
                  <a
                    href="#pricing"
                    className="btn btn-secondary"
                    data-aos="fade-left"
                    data-aos-duration="500"
                    data-aos-delay="1500"
                    data-aos-easing="ease-in-sine"
                  >
                    Đăng ký ngay
                  </a>
                </div>
              </div>
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
