import React from "react";
import { Row, Col } from "antd";

const NutritionLegend = () => (
  <div
    style={{
      margin: "24px 0",
      padding: "16px",
      backgroundColor: "#fafafa",
      borderRadius: "8px",
      border: "1px solid #e8e8e8",
    }}
  >
    <h4 style={{ marginBottom: "12px", color: "#262626" }}>
      Chú thích dinh dưỡng
    </h4>

    <Row gutter={[16, 8]}>
      <Col span={24}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#e6f7ff",
              border: "1px solid #91d5ff",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <span>Tổng khối lượng thực phẩm</span>
        </div>
      </Col>

      <Col span={24}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#fff1f0",
              border: "1px solid #ffa39e",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <span>Lượng protein (đạm)</span>
        </div>
      </Col>

      <Col span={24}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <span>Lượng tinh bột (carb)</span>
        </div>
      </Col>

      <Col span={24}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <span>Lượng chất béo (fat)</span>
        </div>
      </Col>
    </Row>

    <div
      style={{
        marginTop: "12px",
        padding: "10px 12px",
        backgroundColor: "#e6f7ff",
        borderRadius: "6px",
        borderLeft: "4px solid #1890ff",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ color: "#111111", fontSize: "0.9em", fontWeight: "500" }}>
        <span style={{ marginRight: "8px", fontSize: "1.2em" }}>ℹ️</span>
        Lưu ý: Trong carb hoặc fat vẫn có protein nên bạn có thể giảm 1 ít
        protein đi để đúng macro hơn nha tương tự carb và fat
      </span>
    </div>
  </div>
);

export default NutritionLegend;
