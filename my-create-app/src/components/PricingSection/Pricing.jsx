import React, { useState } from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("1-1"); // mặc định là 1-1

  const handleRegister = (plan) => {
    navigate("/register", { state: { selectedPackage: plan } });
  };

  const onlinePlans = [
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
    },
  ];

  const oneOnOnePlans = [
    {
      title: "Cơ bản",
      price: "3.000.000đ",
      features: [
        "Tập 1 kèm 1 (4 buổi/tháng)",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ",
        "Hỗ trợ qua Zalo",
      ],
      buttonClass: "btn-outline",
    },
    {
      title: "Nâng cao",
      price: "4.000.000đ",
      features: [
        "Tập 1 kèm 1 (8 buổi/tháng)",
        "Giáo án cá nhân hóa",
        "Phân tích InBody",
        "Tư vấn phục hồi",
      ],
      featured: true,
      buttonClass: "btn-primary",
    },
    {
      title: "VIP",
      price: "6.000.000đ",
      features: [
        "Huấn luyện hàng tuần không giới hạn",
        "Giám sát chế độ ăn",
        "Cố vấn chuyên sâu",
        "Hỗ trợ 24/7",
      ],
      buttonClass: "btn-outline",
    },
  ];

  const plans = mode === "online" ? onlinePlans : oneOnOnePlans;

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

        {/* Toggle button */}

        <div
          className="mode-switcher"
          data-aos="fade-up"
          data-aos-easing="ease-in-out"
          data-aos-duration="1000"
          data-aos-delay="1300"
        >
          <div className="mode-toggle">
            <input
              type="radio"
              id="oneonone-mode"
              name="mode-toggle"
              checked={mode === "1-1"}
              onChange={() => setMode("1-1")}
            />
            <label htmlFor="oneonone-mode" className="mode-label left-label">
              1 - 1
            </label>

            <input
              type="radio"
              id="online-mode"
              name="mode-toggle"
              checked={mode === "online"}
              onChange={() => setMode("online")}
            />
            <label htmlFor="online-mode" className="mode-label right-label">
              ONLINE
            </label>

            <div
              className={`mode-slider ${
                mode === "1-1" ? "left-active" : "right-active"
              }`}
            ></div>
          </div>
        </div>

        <div
          className="pricing-grid"
          data-aos="fade-up"
          data-aos-easing="ease-in-out"
          data-aos-duration="1000"
          data-aos-delay="1300"
        >
          {plans.map((plan, index) => (
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
              <button
                onClick={() => handleRegister(plan)}
                className={`pricing-btn ${plan.buttonClass}`}
              >
                <span className="btn-text">Đăng ký ngay</span>
                <span className="btn-hover-effect"></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
