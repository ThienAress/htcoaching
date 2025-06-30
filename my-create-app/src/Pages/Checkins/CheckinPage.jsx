// CheckinPage.js
import React from "react";
import CustomerInfoCard from "./CustomerInfoCard";
import CheckinForm from "./CheckinForm";
import CheckinHistoryTable from "./CheckinHistoryTable";
import useCheckinLogic from "../../hook/useCheckinLogic";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import ChatIcons from "../../components/ChatIcons/ChatIcons";

const CheckinPage = () => {
  const checkin = useCheckinLogic();

  return (
    <>
      <HeaderMinimal />
      <div
        style={{
          padding: 24,
          maxWidth: 1400,
          margin: " 0 auto",
          background: "linear-gradient(120deg, #8fd3f4 0%, #f7971e 100%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",

          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginBottom: 32,
            color: "#262626",
            fontWeight: 600,
            fontSize: 24,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            paddingBottom: 16,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          Quản lý Check-in Khách hàng
        </h2>
        <CustomerInfoCard {...checkin} />
        <CheckinForm {...checkin} />
        <CheckinHistoryTable {...checkin} />
      </div>
      <ChatIcons />
      <FooterMinimal />
    </>
  );
};

export default CheckinPage;
