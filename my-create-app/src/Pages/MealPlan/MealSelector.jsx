import React from "react";
import { Card, Select } from "antd";

const { Option } = Select;

const MealSelector = ({
  selectedPlan,
  setSelectedPlan,
  macroSet,
  selectedMacroPlan,
  setSelectedMacroPlan,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24, // Tăng khoảng cách giữa các card
          justifyContent: "center",
          padding: "16px", // Thêm padding tổng
        }}
      >
        <Card
          title="Chế độ dinh dưỡng"
          style={{
            minWidth: 320, // Tăng kích thước tối thiểu
            borderRadius: 12, // Bo góc
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Đổ bóng nhẹ
            border: "1px solid #f0f0f0", // Viền mềm
          }}
          headStyle={{
            background: "#fafafa", // Màu nền tiêu đề
            borderBottom: "1px solid #eee", // Viền dưới tiêu đề
            fontSize: "16px", // Cỡ chữ tiêu đề
            fontWeight: 600, // Đậm tiêu đề
            borderRadius: "12px 12px 0 0", // Bo góc trên
          }}
        >
          <Select
            style={{
              width: "100%",
              height: 42, // Tăng chiều cao
              borderRadius: 8, // Bo góc
            }}
            placeholder="Chọn chế độ"
            value={selectedMacroPlan}
            onChange={setSelectedMacroPlan}
            loading={!macroSet}
          >
            {macroSet &&
              Object.keys(macroSet).map((plan) => (
                <Option key={plan} value={plan}>
                  {plan}
                </Option>
              ))}
          </Select>
          {selectedMacroPlan && macroSet[selectedMacroPlan] && (
            <div
              style={{
                marginTop: 24, // Tăng khoảng cách
                padding: "12px 16px", // Thêm padding
                background: "#f9f9f9", // Màu nền nhẹ
                borderRadius: 8, // Bo góc
                border: "1px solid #f0f0f0", // Viền mờ
              }}
            >
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Đạm:{" "}
                <span style={{ color: "#cf1322" }}>
                  {macroSet[selectedMacroPlan].protein}g
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Tinh bột:{" "}
                <span style={{ color: "#389e0d" }}>
                  {macroSet[selectedMacroPlan].carb}g
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Chất béo:{" "}
                <span style={{ color: "#d48806" }}>
                  {macroSet[selectedMacroPlan].fat}g
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Calories:{" "}
                <span style={{ color: "#096dd9" }}>
                  {Math.round(
                    macroSet[selectedMacroPlan].calories
                  ).toLocaleString()}{" "}
                  kcal
                </span>
              </p>
            </div>
          )}
        </Card>

        <Card
          title={`Số bữa/ngày (${selectedPlan} bữa)`}
          style={{
            minWidth: 320,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid #f0f0f0",
          }}
          headStyle={{
            background: "#fafafa",
            borderBottom: "1px solid #eee",
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Select
            style={{
              width: "100%",
              height: 42,
              borderRadius: 8,
            }}
            value={selectedPlan}
            onChange={setSelectedPlan}
          >
            {[3, 4, 5, 6].map((num) => (
              <Option key={num} value={num}>
                {num} bữa
              </Option>
            ))}
          </Select>
          {selectedMacroPlan && macroSet[selectedMacroPlan] && (
            <div
              style={{
                marginTop: 24,
                padding: "12px 16px",
                background: "#f9f9f9",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
              }}
            >
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Đạm:{" "}
                <span style={{ color: "#cf1322" }}>
                  {Math.round(
                    macroSet[selectedMacroPlan].protein / selectedPlan
                  )}
                  g
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Tinh bột:{" "}
                <span style={{ color: "#389e0d" }}>
                  {Math.round(macroSet[selectedMacroPlan].carb / selectedPlan)}g
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Chất béo:{" "}
                <span style={{ color: "#d48806" }}>
                  {Math.round(macroSet[selectedMacroPlan].fat / selectedPlan)}g
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                Calories:{" "}
                <span style={{ color: "#096dd9" }}>
                  {Math.round(
                    macroSet[selectedMacroPlan].calories / selectedPlan
                  )}{" "}
                  kcal
                </span>
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default MealSelector;
