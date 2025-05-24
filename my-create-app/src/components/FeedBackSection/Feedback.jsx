import { useEffect } from "react";
import FeedbackCard from "./FeedbackCard";
import "./Feedback.css";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

const feedbacks = [
  {
    beforeImg: "/images/hero.jpg",
    afterImg: "/images/class2.jpg",
    name: "Nguyễn Thảo",
    age: "23",
    job: "Giáo viên, 29 tuổi",
    result: "-10kg",
    duration: "21 tuần",
    message: "Mình từng mất tự tin... Huấn luyện viên rất tận tâm!",
  },
  {
    beforeImg: "/images/hero3.jpg",
    afterImg: "/images/hero4.jpg",
    name: "Nguyễn Văn A",
    age: "30",
    job: "Nhân viên văn phòng",
    result: "-8kg",
    duration: "18 tuần",
    message: "Tôi cảm thấy khỏe hơn và tự tin hơn rất nhiều!",
  },
  // 👉 Có thể thêm nhiều feedback khác tại đây
];

function Feedback() {
  useEffect(() => {
    const swiperInstance = new Swiper(".feedback-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: feedbacks.length > 1, // Chỉ bật loop khi đủ slide
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      effect: "slide",
      speed: 800,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    return () => {
      swiperInstance.destroy();
    };
  }, []);

  return (
    <section className="customer" id="customer">
      <div className="container">
        <h2>Câu chuyện thay đổi của khách hàng</h2>
        <div className="swiper feedback-slider">
          <div className="swiper-wrapper">
            {feedbacks.map((fb, index) => (
              <FeedbackCard key={index} {...fb} />
            ))}
          </div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </section>
  );
}

export default Feedback;
