import React from "react";
import { Tag, Image, Select } from "antd";
import dayjs from "dayjs";
const { Option } = Select;

const CustomerInfoCard = ({ customerData, isAdmin, loading, user }) => {
  // State để chọn loại gói nếu muốn thao tác (ví dụ filter checkin, KHÔNG ảnh hưởng hiển thị các gói bên dưới)
  const [selectedPlanMode, setSelectedPlanMode] = React.useState("all");

  // Lấy ra tất cả các planMode duy nhất từ đơn hàng
  const planModes = React.useMemo(
    () =>
      Array.from(
        new Set(
          (customerData?.orders || []).map(
            (order) => order.planMode || "Không xác định"
          )
        )
      ),
    [customerData?.orders]
  );

  // Trường hợp không có dữ liệu
  if ((!customerData || !customerData.orders) && !isAdmin && !loading)
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

  if (!customerData || !customerData.orders) return null;

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        marginBottom: 24,
        border: "1px solid #e8e8e8",
        boxShadow:
          "0 1px 2px -2px rgba(0,0,0,0.08), 0 3px 6px 0 rgba(0,0,0,0.06), 0 5px 12px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Thông tin cơ bản */}
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
            {/* Có thể bỏ 2 block dưới nếu không cần tổng số buổi cộng dồn */}
          </div>
        </div>
      </div>

      {/* Ô select loại gói để thao tác riêng biệt */}
      <div style={{ marginTop: 24 }}>
        <h4
          style={{
            fontSize: 16,
            color: "#262626",
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Chọn loại gói tập:
        </h4>
        <Select
          value={selectedPlanMode}
          onChange={setSelectedPlanMode}
          style={{ width: 220, marginBottom: 16 }}
        >
          <Option value="all">Tất cả các loại gói</Option>
          {planModes.map((mode) => (
            <Option key={mode} value={mode}>
              {mode === "1-1"
                ? "Gói 1-1"
                : mode === "online"
                ? "Gói Online"
                : mode}
            </Option>
          ))}
        </Select>
      </div>

      {/* Luôn luôn hiển thị đầy đủ từng gói KH đã mua, không gộp */}
      <div style={{ marginTop: 8 }}>
        <h4
          style={{
            fontSize: 16,
            color: "#262626",
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Chi tiết các gói tập:
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {(customerData.orders || []).map((order, idx) => (
            <div
              key={order.id || idx}
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
              <p style={{ marginBottom: 8, fontWeight: 500, color: "#262626" }}>
                <span style={{ color: "#1890ff" }}>Gói {idx + 1}:</span>{" "}
                {order.packageTitle}
                {order.planMode && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontWeight: 500,
                      color: "#888",
                    }}
                  >
                    (
                    {order.planMode === "1-1"
                      ? "1-1"
                      : order.planMode === "online"
                      ? "Online"
                      : order.planMode}
                    )
                  </span>
                )}
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
    </div>
  );
};

export default CustomerInfoCard;
