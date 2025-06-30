// CustomerInfoCard.js
import React from "react";
import { Tag, Image } from "antd";
import dayjs from "dayjs";

const CustomerInfoCard = ({ customerData, isAdmin, loading, user }) => {
  if (!customerData && !isAdmin && !loading)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          border: "1px dashed #e8e8e8",
          borderRadius: 8,
          marginBottom: 24,
          backgroundColor: "#fafafa",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h3 style={{ color: "#ff4d4f", fontSize: 18 }}>
          Không tìm thấy thông tin gói tập
        </h3>
        <p style={{ marginTop: 8, color: "#595959" }}>
          Vui lòng liên hệ quản trị viên để được hỗ trợ hoặc kiểm tra lại email
          đăng nhập
        </p>
        <p style={{ marginTop: 4, color: "#595959" }}>
          Email đăng nhập:{" "}
          <strong style={{ color: "#262626" }}>
            {user?.email || "Chưa xác định"}
          </strong>
        </p>
      </div>
    );

  if (!customerData) return null;

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        marginBottom: 24,
        border: "1px solid #e8e8e8",
        boxShadow:
          "0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          marginBottom: 16,
        }}
      >
        {customerData.photoURL && (
          <Image
            src={customerData.photoURL}
            alt="Avatar"
            width={120}
            height={120}
            style={{
              borderRadius: "50%",
              border: "3px solid #1890ff",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(24, 144, 255, 0.2)",
            }}
            preview={false}
          />
        )}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              marginBottom: 16,
              fontSize: 20,
              color: "#262626",
              fontWeight: 600,
            }}
          >
            {customerData.name}
          </h3>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ minWidth: 200 }}>
              <p style={{ marginBottom: 8, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  SĐT:
                </strong>{" "}
                {customerData.phone}
              </p>
              <p style={{ marginBottom: 0, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Email:
                </strong>{" "}
                {customerData.email}
              </p>
            </div>
            <div style={{ minWidth: 200 }}>
              <p style={{ marginBottom: 8, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Gói tập:
                </strong>{" "}
                <Tag color="#1890ff" style={{ fontWeight: 500 }}>
                  {customerData.packageTitle}
                </Tag>
              </p>
              <p style={{ marginBottom: 8, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Loại:
                </strong>{" "}
                <Tag
                  color={
                    customerData.planMode === "1-1" ? "#1890ff" : "#fa8c16"
                  }
                  style={{ fontWeight: 500 }}
                >
                  {customerData.planMode}
                </Tag>
              </p>
              <p style={{ marginBottom: 0, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Phòng tập:
                </strong>{" "}
                {customerData.location}
              </p>
            </div>
            <div style={{ minWidth: 200 }}>
              <p style={{ marginBottom: 8, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Tổng buổi:{" "}
                </strong>{" "}
                {customerData.totalSessions}
              </p>
              <p style={{ marginBottom: 8, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Đã dùng:{" "}
                </strong>{" "}
                {customerData.usedSessions}
              </p>
              <p style={{ marginBottom: 0, color: "#595959" }}>
                <strong style={{ color: "#262626", marginRight: 4 }}>
                  Còn lại:{" "}
                </strong>
                <Tag
                  color={
                    customerData.remainingSessions > 5
                      ? "#52c41a"
                      : customerData.remainingSessions > 0
                      ? "#fa8c16"
                      : "#ff4d4f"
                  }
                  style={{ fontWeight: 500 }}
                >
                  {customerData.remainingSessions}
                </Tag>
              </p>
            </div>
          </div>
        </div>
      </div>

      {customerData.orders?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4
            style={{
              fontSize: 16,
              color: "#262626",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            Chi tiết các gói tập:
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {customerData.orders.map((order, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  padding: 16,
                  minWidth: 220,
                  backgroundColor:
                    order.remainingSessions > 0 ? "#f6ffed" : "#fff1f0",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <p
                  style={{ marginBottom: 8, fontWeight: 500, color: "#262626" }}
                >
                  <span style={{ color: "#1890ff" }}>Gói {index + 1}:</span>{" "}
                  {order.packageTitle}
                </p>
                <p style={{ marginBottom: 4, color: "#595959" }}>
                  <strong style={{ color: "#262626", marginRight: 4 }}>
                    Số buổi:
                  </strong>{" "}
                  {order.totalSessions}
                </p>
                <p style={{ marginBottom: 4, color: "#595959" }}>
                  <strong style={{ color: "#262626", marginRight: 4 }}>
                    Còn lại:
                  </strong>
                  <Tag
                    color={order.remainingSessions > 0 ? "#52c41a" : "#ff4d4f"}
                    style={{ marginLeft: 4, fontWeight: 500 }}
                  >
                    {order.remainingSessions}
                  </Tag>
                </p>
                <p style={{ marginBottom: 0, color: "#8c8c8c", fontSize: 12 }}>
                  {order.createdAt?.toDate
                    ? dayjs(order.createdAt.toDate()).format("DD/MM/YYYY")
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerInfoCard;
