import FeedbackCard from "./FeedbackCard";

function Feedback() {
  return (
    <section className="customer" id="customer">
      <div className="container">
        <h2>Câu chuyện thay đổi của khách hàng</h2>
        <div className="swiper feedback-slider">
          <div className="swiper-wrapper">
            <FeedbackCard
              beforeImg="/assets/images/tu.jpg"
              afterImg="/assets/images/class2.jpg"
              name="Nguyễn Thảo"
              age="23"
              job="Giáo viên, 29 tuổi"
              result="-10kg"
              duration="21 tuần"
              message="Mình từng mất tự tin... Huấn luyện viên rất tận tâm!"
            />
            {/* Thêm các FeedbackCard khác tương tự */}
          </div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </section>
  );
}

export default Feedback;
