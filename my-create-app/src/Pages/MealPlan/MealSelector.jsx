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
          gap: 16,
          justifyContent: "center",
        }}
      >
        <Card title="Chế độ dinh dưỡng" style={{ minWidth: 300 }}>
          <Select
            style={{ width: "100%" }}
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
            <div style={{ marginTop: 16 }}>
              <p>Đạm: {macroSet[selectedMacroPlan].protein}g</p>
              <p>Tinh bột: {macroSet[selectedMacroPlan].carb}g</p>
              <p>Chất béo: {macroSet[selectedMacroPlan].fat}g</p>
              <p>
                Calories:{" "}
                {Math.round(
                  macroSet[selectedMacroPlan].calories
                ).toLocaleString()}{" "}
                kcal
              </p>
            </div>
          )}
        </Card>

        <Card
          title={`Số bữa/ngày (${selectedPlan} bữa)`}
          style={{ minWidth: 300 }}
        >
          <Select
            style={{ width: "100%" }}
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
            <div style={{ marginTop: 16 }}>
              <p>
                Đạm:{" "}
                {Math.round(macroSet[selectedMacroPlan].protein / selectedPlan)}
                g
              </p>
              <p>
                Tinh bột:{" "}
                {Math.round(macroSet[selectedMacroPlan].carb / selectedPlan)}g
              </p>
              <p>
                Chất béo:{" "}
                {Math.round(macroSet[selectedMacroPlan].fat / selectedPlan)}g
              </p>
              <p>
                Calories:{" "}
                {Math.round(
                  macroSet[selectedMacroPlan].calories / selectedPlan
                )}{" "}
                kcal
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default MealSelector;
