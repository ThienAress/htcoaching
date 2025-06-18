import React, { useState } from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContent/UserContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function Pricing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("1-1");
  const { user } = useUser();

  const handleRegister = (plan) => {
    const planMode =
      mode === "trial" ? "Trải nghiệm" : mode === "1-1" ? "1-1" : "Online";

    if (plan.title === "Trail") {
      if (!user) {
        alert("Bạn cần đăng nhập để sử dụng gói Trải nghiệm.");
        navigate("/login");
        return;
      }

      checkTrialEligibility(user.uid, plan, planMode);
    } else {
      navigate("/register", { state: { selectedPackage: plan, planMode } });
    }
  };

  const checkTrialEligibility = async (uid, plan, planMode) => {
    const q = query(
      collection(db, "orders"),
      where("uid", "==", uid),
      where("planMode", "==", planMode)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert(
        "Bạn đã từng sử dụng gói Trải nghiệm. Mỗi tài khoản chỉ được dùng 1 lần."
      );
      return;
    }

    navigate("/register", { state: { selectedPackage: plan, planMode } });
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
      buttonClass: "pricing-outline-btn",
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
      buttonClass: "pricing-primary-btn",
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
      buttonClass: "pricing-outline-btn",
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
      buttonClass: "pricing-outline-btn",
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
      buttonClass: "pricing-primary-btn",
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
      buttonClass: "pricing-outline-btn",
    },
  ];

  const trialPlan = {
    title: "Trail",
    price: "6.000.000đ",
    features: [
      "1 buổi tập 1-1 hoặc 3 ngày tập online",
      "Đánh giá thể lực chuyên sâu",
      "Tư vấn lộ trình tập cá nhân",
      "Hỗ trợ PT trong suốt thời gian dùng thử",
    ],
    buttonClass: "pricing-outline-btn",
  };

  const plans = mode === "online" ? onlinePlans : oneOnOnePlans;

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title title">Gói tập của chúng tôi</h2>
        <p className="section-subtitle desc">
          Lựa chọn gói tập phù hợp với nhu cầu của bạn
        </p>

        <div className="mode-selection-row">
          <div className="toggle-container">
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
                  mode === "1-1"
                    ? "left-active"
                    : mode === "online"
                    ? "right-active"
                    : "hidden"
                }`}
              ></div>
            </div>
          </div>

          <button
            className={`trial-toggle-btn ${mode === "trial" ? "active" : ""}`}
            onClick={() => setMode("trial")}
          >
            TRẢI NGHIỆM
          </button>
        </div>

        <div className="pricing-content">
          {mode === "trial" ? (
            <div className="trial-card-center">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>{trialPlan.title}</h3>
                  <div className="price">
                    <span>{trialPlan.price}</span>
                    <span>/tháng</span>
                  </div>
                </div>
                <div className="pricing-features">
                  <ul>
                    {trialPlan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleRegister(trialPlan)}
                  className={`pricing-btn ${trialPlan.buttonClass}`}
                >
                  <span className="btn-text">Đăng ký ngay</span>
                  <span className="btn-hover-effect"></span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pricing-grid">
              {plans.map((plan, index) => (
                <div
                  className={`pricing-card ${plan.featured ? "featured" : ""}`}
                  key={index}
                >
                  {plan.featured && (
                    <div className="pricing-badge">Phổ biến</div>
                  )}
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
          )}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
