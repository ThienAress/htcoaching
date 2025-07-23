import React, { useState, useEffect } from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContent/UserContext";
import { Modal, Button } from "antd";
import {
  getDocs,
  query,
  collection,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  FireOutlined,
  ExclamationCircleFilled,
  GiftOutlined,
} from "@ant-design/icons";

function Pricing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("1-1");
  const { user } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTrialWarning, setShowTrialWarning] = useState(false);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [hasOrderedBefore, setHasOrderedBefore] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [selectedGifts, setSelectedGifts] = useState([]);

  useEffect(() => {
    const checkOrders = async () => {
      if (user) {
        const qOrders = query(
          collection(db, "orders"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(qOrders);

        setHasOrderedBefore(!snapshot.empty);

        const trial = snapshot.docs.find(
          (doc) => doc.data().planMode === "Trải nghiệm"
        );
        setHasUsedTrial(!!trial);
      }
    };
    checkOrders();
  }, [user]);

  const handleRegister = async (plan) => {
    const planMode =
      mode === "trial" ? "Trải nghiệm" : mode === "1-1" ? "1-1" : "Online";

    const priceNumber = parseInt(plan.price.replace(/\D/g, ""));
    const applyDiscount = !hasOrderedBefore && planMode !== "Trải nghiệm";
    const discount = applyDiscount ? Math.floor(priceNumber * 0.15) : 0;
    const total = priceNumber - discount;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (planMode === "Trải nghiệm" && hasUsedTrial) {
      setShowTrialWarning(true);
      return;
    }

    // 👇 Truy vấn đơn hàng mới nhất để lấy lại thông tin khách hàng nếu đã mua
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const lastOrder = snap.docs[0].data();

      //  Nếu cùng loại gói thì xử lý cộng dồn
      const isSamePlanMode = lastOrder.planMode === planMode;

      navigate("/payment", {
        state: {
          selectedPackage: {
            ...plan,
            totalSessions: Number(plan.totalSessions),
          },
          planMode,
          originalPrice: priceNumber,
          discount,
          total,
          reuseInfo: {
            name: lastOrder.name,
            phone: lastOrder.phone,
            email: lastOrder.email,
            location: lastOrder.location,
            note: lastOrder.note || "",
            reusedFromOrderId: snap.docs[0].id,
            oldRemainingSessions: isSamePlanMode
              ? Number(lastOrder.remainingSessions || 0)
              : 0,
            allowMerge: isSamePlanMode,
          },
        },
      });
      return;
    }

    // 👇 Nếu chưa có đơn hàng nào ➝ tiếp tục đăng ký như bình thường
    navigate("/register", {
      state: {
        selectedPackage: {
          ...plan,
          totalSessions: Number(plan.totalSessions),
        },
        planMode,
        originalPrice: priceNumber,
        discount,
        total,
      },
    });
  };

  const showGiftModal = (gifts) => {
    setSelectedGifts(gifts);
    setGiftModalVisible(true);
  };

  const onlinePlans = [
    {
      title: "Cơ bản",
      price: "4.800.000đ",
      durationText: "/8tuần",
      features: [
        "Tập 1 kèm 1",
        "Giáo án cá nhân hóa",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ theo tuần",
        "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
        "Hỗ trợ căng cơ phục hồi sau tập",
        "Cam kết kết quả 100%",
      ],
      gifts: [],
      buttonClass: "pricing-outline-btn",
      totalSessions: 24,
    },
    {
      title: "Nâng cao",
      price: "12.000.000đ",
      durationText: "/16tuần",
      features: [
        "Tập 1 kèm 1",
        "Giáo án cá nhân hóa",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ theo tuần",
        "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
        "Hỗ trợ căng cơ phục hồi sau tập",
        "Cam kết kết quả 100%",
      ],
      gifts: [],
      featured: true,
      buttonClass: "pricing-primary-btn",
      totalSessions: 48,
    },
    {
      title: "VIP",
      price: "21.600.000đ",
      durationText: "/24tuần",
      features: [
        "Tập 1 kèm 1",
        "Giáo án cá nhân hóa",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ theo tuần",
        "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
        "Hỗ trợ căng cơ phục hồi sau tập",
        "Cam kết kết quả 100%",
      ],
      gifts: [],
      buttonClass: "pricing-outline-btn",
      totalSessions: 72,
    },
  ];

  const oneOnOnePlans = [
    {
      title: "Cơ bản",
      price: "8.400.000đ",
      durationText: "/8tuần",
      features: [
        "Tập 1 kèm 1",
        "Giáo án cá nhân hóa",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ theo tuần",
        "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
        "Hỗ trợ căng cơ phục hồi sau tập",
        "Cam kết kết quả 100%",
      ],
      gifts: ["Shaker Bình Lắc Cao Cấp 600ml"],
      buttonClass: "pricing-outline-btn",
      totalSessions: 24,
    },
    {
      title: "Nâng cao",
      price: "19.200.000đ",
      durationText: "/16tuần",
      features: [
        "Tập 1 kèm 1",
        "Giáo án cá nhân hóa",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ theo tuần",
        "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
        "Hỗ trợ căng cơ phục hồi sau tập",
        "Cam kết kết quả 100%",
      ],
      gifts: ["Shaker Bình Lắc Cao Cấp 600ml", "2 bánh Biscotti 300g"],
      featured: true,
      buttonClass: "pricing-primary-btn",
      totalSessions: 48,
    },
    {
      title: "VIP",
      price: "32.400.000đ",
      durationText: "/24tuần",
      features: [
        "Tập 1 kèm 1",
        "Giáo án cá nhân hóa",
        "Tư vấn dinh dưỡng riêng",
        "Theo dõi tiến độ theo tuần",
        "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
        "Hỗ trợ căng cơ phục hồi sau tập",
        "Cam kết kết quả 100%",
      ],
      gifts: [
        "Whey Protein Isolate cao cấp",
        "Shaker Bình Lắc Cao Cấp 600ml",
        "2 bánh Biscotti 300g",
      ],
      buttonClass: "pricing-outline-btn",
      totalSessions: 72,
    },
  ];

  const trialPlan = {
    title: "Trial",
    price: "6.000.000đ",
    durationText: "/4tuần",
    features: [
      "Tập 1 kèm 1",
      "Giáo án cá nhân hóa",
      "Tư vấn dinh dưỡng riêng",
      "Theo dõi tiến độ theo tuần",
      "Sử dụng Notion để lưu trữ bài tập, tiến độ một cách thông minh",
      "Hỗ trợ căng cơ phục hồi sau tập",
      "Cam kết kết quả 100%",
    ],
    gifts: [],
    buttonClass: "pricing-outline-btn",
    totalSessions: 12,
  };

  const plans = mode === "online" ? onlinePlans : oneOnOnePlans;

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Gói tập của chúng tôi</h2>
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

        <div className="pricing-grid">
          {(mode === "trial" ? [trialPlan] : plans).map((plan, index) => (
            <div
              className={`pricing-card ${plan.featured ? "featured" : ""}`}
              key={index}
            >
              {plan.featured && <div className="pricing-badge">Phổ biến</div>}
              <div className="pricing-header">
                <h3>{plan.title}</h3>
                <div className="price">
                  <span>{plan.price}</span>
                  <span>{plan.durationText || "/tháng"}</span>
                </div>
              </div>
              <div className="pricing-features">
                <ul>
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Phần quà tặng tóm tắt */}
              {plan.gifts && plan.gifts.length > 0 && (
                <div
                  className="pricing-gift-summary"
                  onClick={() => showGiftModal(plan.gifts)}
                >
                  <span className="gift-icon">🎁</span> QUÀ TẶNG ĐẶC BIỆT
                </div>
              )}

              <div className="pricing-sessions">
                <span>Tổng số buổi: {plan.totalSessions}</span>
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

        {/* Modal đăng nhập */}
        <Modal
          open={showLoginModal}
          onCancel={() => setShowLoginModal(false)}
          closable={false}
          onOk={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
          okText="Đăng nhập"
          cancelText="Hủy"
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FireOutlined style={{ color: "#fff" }} />
              <span>Yêu cầu đăng nhập</span>
            </span>
          }
          styles={{
            content: {
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              maxWidth: 420,
            },
            header: {
              background: "linear-gradient(90deg, #ff4d00 0%, #ff9500 100%)",
              borderBottom: "none",
              padding: "20px 24px",
            },
            body: {
              padding: 24,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#555",
              borderBottom: "1px solid #f0f0f0",
            },
            footer: {
              borderTop: "none",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            },
            mask: {
              backdropFilter: "blur(3px)",
            },
          }}
          okButtonProps={{
            style: {
              height: 40,
              padding: "0 24px",
              fontWeight: 600,
              borderRadius: 8,
              background: "linear-gradient(90deg, #ff4d00 0%, #ff9500 100%)",
              border: "none",
              boxShadow: "0 2px 8px rgba(255, 77, 0, 0.3)",
            },
          }}
          cancelButtonProps={{
            style: {
              height: 40,
              padding: "0 24px",
              fontWeight: 600,
              borderRadius: 8,
              border: "1px solid #d9d9d9",
            },
          }}
        >
          <div style={{ padding: "8px 0" }}>
            <p style={{ marginBottom: 12, fontWeight: 500 }}>
              Để đăng ký gói tập và nhận{" "}
              <strong style={{ color: "#ff4d00" }}>ưu đãi 15%</strong>, vui lòng
              đăng nhập tài khoản.
            </p>
          </div>
        </Modal>

        {/* Modal cảnh báo đã dùng Trial */}
        <Modal
          open={showTrialWarning}
          onCancel={() => setShowTrialWarning(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setShowTrialWarning(false)}
              style={{
                background: "#ff4d00",
                borderColor: "#ff4d00",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Close
            </Button>,
          ]}
          closable={false}
          styles={{
            content: {
              borderRadius: 12,
              maxWidth: 400,
              textAlign: "center",
            },
            body: {
              padding: "24px",
              fontSize: 16,
            },
            footer: {
              borderTop: "none",
              padding: "0 24px 24px",
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <ExclamationCircleFilled
              style={{
                fontSize: 48,
                color: "#ff4d00",
                marginBottom: 16,
              }}
            />
            <h3
              style={{
                color: "#ff4d00",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Bạn đã sử dụng gói Trải nghiệm
            </h3>
            <p style={{ color: "#555" }}>
              Mỗi tài khoản chỉ được sử dụng gói Trải nghiệm một lần.
            </p>
          </div>
        </Modal>

        {/* Modal quà tặng */}
        <Modal
          open={giftModalVisible}
          onCancel={() => setGiftModalVisible(false)}
          footer={null}
          centered
          closable={true}
          className="gift-modal"
        >
          <div className="gift-modal-content">
            <h3 className="gift-modal-title">
              <span className="gift-icon-large">🎁</span> QUÀ TẶNG ĐẶC BIỆT
            </h3>
            <div className="gift-list">
              {selectedGifts.map((gift, index) => (
                <div key={index} className="gift-item">
                  <div className="gift-bullet">✓</div>
                  <div className="gift-text">{gift}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
}

export default Pricing;
