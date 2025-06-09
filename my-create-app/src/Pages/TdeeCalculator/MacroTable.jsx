import React from "react";

const MacroTable = ({ macroSet, tdee, adjustedCalories, goal }) => {
  if (!macroSet) return null;

  const goalText =
    goal === "gain"
      ? "tăng cân"
      : goal === "lose"
      ? "giảm cân"
      : "duy trì cân nặng";

  return (
    <>
      <p className="macro-note">
        Đây là lượng calories mình đã điều chỉnh từ TDEE ban đầu của bạn là{" "}
        <strong>{tdee}</strong> kcal thành lượng calories cần thiết để{" "}
        <strong>{goalText}</strong> là <strong>{adjustedCalories}</strong> kcal.
        Theo dõi và thay đổi theo tuần cho phù hợp bạn nhé.
      </p>

      <div className="macro-table">
        {Object.entries(macroSet).map(([goalName, values]) => (
          <div className="macro-card" key={goalName}>
            <h4>{goalName}</h4>
            <div className="macro-row">
              <strong>{values.protein}g</strong>
              <span>Protein</span>
            </div>
            <div className="macro-row">
              <strong>{values.fat}g</strong>
              <span>Fat</span>
            </div>
            <div className="macro-row">
              <strong>{values.carb}g</strong>
              <span>Carbs</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MacroTable;
