function Pricing() {
  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2
          className="section-title title"
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          Gói tập của chúng tôi
        </h2>
        <p
          className="section-subtitle desc"
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="500"
          data-aos-delay="1000"
        >
          Lựa chọn gói tập phù hợp với nhu cầu của bạn
        </p>

        <div
          className="pricing-grid"
          data-aos="fade-up"
          data-aos-easing="ease-in-out"
          data-aos-duration="1000"
          data-aos-delay="1300"
        >
          {[
            {
              title: "Cơ bản",
              price: "1.500.000đ",
              features: [
                "Truy cập phòng tập",
                "Lớp nhóm cơ bản",
                "Không có PT cá nhân",
                "Tư vấn dinh dưỡng cơ bản",
              ],
              buttonClass: "btn-outline",
              link: "finance.html",
            },
            {
              title: "Nâng cao",
              price: "2.500.000đ",
              features: [
                "Truy cập phòng tập",
                "Tất cả lớp nhóm",
                "2 buổi PT/tháng",
                "Tư vấn dinh dưỡng",
              ],
              featured: true,
              buttonClass: "btn-primary",
              link: "#",
            },
            {
              title: "VIP",
              price: "5.000.000đ",
              features: [
                "Truy cập không giới hạn",
                "Tất cả lớp nhóm",
                "PT cá nhân không giới hạn",
                "Tư vấn dinh dưỡng chuyên sâu",
              ],
              buttonClass: "btn-outline",
              link: "#",
            },
          ].map((plan, index) => (
            <div
              className={`pricing-card ${plan.featured ? "featured" : ""}`}
              key={index}
            >
              {plan.featured && <div className="pricing-badge">Phổ biến</div>}
              <div className="pricing-header">
                <h3>{plan.title}</h3>
                <div className="price">
                  <span>{plan.price}</span>
                  <span>/tháng</span>
                </div>
              </div>
              <div className="pricing-features">
                <ul>
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              <a href={plan.link} className={`btn ${plan.buttonClass}`}>
                Đăng ký ngay
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Pricing;
