import React from "react";
import { Card, Typography, Row, Col } from "antd";

const { Title, Text } = Typography;

const MealSummary = ({
  totalMacros,
  totalCalories,
  macroSet,
  selectedMacroPlan,
}) => {
  // Nếu dữ liệu chưa sẵn sàng thì không render
  if (
    !totalMacros ||
    totalMacros.protein === undefined ||
    totalMacros.carb === undefined ||
    totalMacros.fat === undefined
  ) {
    return null;
  }

  return (
    <Card title="Tổng dinh dưỡng cả ngày" style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} style={{ color: "#cf1322" }}>
              Đạm
            </Title>
            <Text strong style={{ fontSize: 18 }}>
              {totalMacros.protein}g
            </Text>
            <div>
              <Text type="secondary">
                {totalCalories > 0
                  ? Math.round((totalMacros.protein * 4 * 100) / totalCalories)
                  : 0}
                % calories
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} style={{ color: "#389e0d" }}>
              Tinh bột
            </Title>
            <Text strong style={{ fontSize: 18 }}>
              {totalMacros.carb}g
            </Text>
            <div>
              <Text type="secondary">
                {totalCalories > 0
                  ? Math.round((totalMacros.carb * 4 * 100) / totalCalories)
                  : 0}
                % calories
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} style={{ color: "#d48806" }}>
              Chất béo
            </Title>
            <Text strong style={{ fontSize: 18 }}>
              {totalMacros.fat}g
            </Text>
            <div>
              <Text type="secondary">
                {totalCalories > 0
                  ? Math.round((totalMacros.fat * 9 * 100) / totalCalories)
                  : 0}
                % calories
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Title level={3}>
          Tổng Calories: {totalCalories.toLocaleString()} kcal
        </Title>
        {selectedMacroPlan && macroSet?.[selectedMacroPlan] && (
          <Text
            type={
              totalCalories > macroSet[selectedMacroPlan].calories * 1.1
                ? "danger"
                : totalCalories < macroSet[selectedMacroPlan].calories * 0.9
                ? "warning"
                : "success"
            }
            style={{ fontSize: 16 }}
          >
            {Math.abs(
              totalCalories - Math.round(macroSet[selectedMacroPlan].calories)
            )}{" "}
            kcal{" "}
            {totalCalories > macroSet[selectedMacroPlan].calories
              ? "vượt"
              : "dưới"}{" "}
            mục tiêu (
            {Math.round(
              (totalCalories / macroSet[selectedMacroPlan].calories) * 100
            )}
            %)
          </Text>
        )}
      </div>
    </Card>
  );
};

export default MealSummary;
