import React, { useEffect, useState } from "react";
import { Modal, Typography, Button } from "antd";
import { GiftOutlined, ThunderboltOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const GymPromotionPopup = () => {
  const [visible, setVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("promo_shown");

    if (!hasShown) {
      const showTimer = setTimeout(() => {
        setVisible(true);
        setTimeout(() => setFadeIn(true), 50);
        sessionStorage.setItem("promo_shown", "true");
      }, 1500);

      return () => {
        clearTimeout(showTimer);
      };
    }
  }, []);

  const handleClose = (scrollToPricing = false) => {
    setFadeIn(false);
    setTimeout(() => {
      setVisible(false);
      if (scrollToPricing) {
        const pricingSection = document.getElementById("pricing");
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 300);
  };

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      onCancel={() => handleClose(false)}
      styles={{
        content: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
        body: {
          padding: 32,
          textAlign: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          borderRadius: 12,
          color: "#fff",
          border: "2px solid #ff4d00",
          boxShadow: "0 0 20px rgba(255, 77, 0, 0.6)",
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "scale(1)" : "scale(0.95)",
          transition: "all 0.3s ease-out",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000')",
          backgroundSize: "cover",
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <GiftOutlined
          style={{
            fontSize: 48,
            color: "#ff4d00",
            marginBottom: 16,
            filter: "drop-shadow(0 0 8px rgba(255, 77, 0, 0.8))",
            transform: fadeIn ? "rotate(0deg)" : "rotate(-20deg)",
            transition: "transform 0.3s",
          }}
        />
        <Title
          level={3}
          style={{
            color: "#ff4d00",
            fontWeight: "800",
            marginBottom: 12,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.3s 0.1s",
          }}
        >
          Khuyến mãi độc quyền{" "}
          <span style={{ color: "#ffcc00" }}>"CÓ 1 KHÔNG 2"</span>
        </Title>
        <Paragraph
          style={{
            fontSize: 16,
            color: "#ffcc00",
            fontWeight: "600",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.3s 0.2s",
          }}
        >
          Tất cả khách hàng lần đầu đăng ký gói tập sẽ được hưởng ngay{" "}
          <strong style={{ color: "#00ff88" }}>giảm 15%</strong> cho mọi gói
          tập.
        </Paragraph>
        <Paragraph
          style={{
            fontSize: 16,
            color: "#e2e8f0",
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.3s 0.3s",
          }}
        >
          <ThunderboltOutlined
            style={{ marginRight: 8, color: "#ffcc00", fontSize: 18 }}
          />
          Nhanh tay trải nghiệm – cơ hội không thể bỏ lỡ!
        </Paragraph>
        <Button
          type="primary"
          size="large"
          style={{
            background: "linear-gradient(90deg, #ff4d00 0%, #ff9500 100%)",
            border: "none",
            fontWeight: "bold",
            marginTop: 24,
            padding: "8px 28px",
            fontSize: 16,
            boxShadow: "0 4px 12px rgba(255, 77, 0, 0.4)",
            height: "auto",
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.3s 0.4s",
          }}
          onClick={() => handleClose(true)}
        >
          Tập ngay!
        </Button>
      </div>
    </Modal>
  );
};

export default GymPromotionPopup;
