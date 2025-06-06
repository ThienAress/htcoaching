import React from "react";

const TdeeResultBox = ({ tdee, bmr, adjustedCalories, goal }) => {
  return (
    <div className="tdee-result-box">
      <div className="result-card">
        <h4>TDEE của bạn:</h4>
        <div className="value">
          {tdee} <span>kcal/ngày</span>
        </div>
      </div>
      <div className="result-card">
        <h4>BMR của bạn:</h4>
        <div className="value">
          {bmr} <span>kcal/ngày</span>
        </div>
      </div>
      <div className="result-card">
        <h4>
          Lượng calories cần thiết (
          {goal === "gain"
            ? "tăng cân"
            : goal === "lose"
            ? "giảm mỡ"
            : "duy trì"}
          ):
        </h4>
        <div className="value">
          {adjustedCalories} <span>kcal/ngày</span>
        </div>
      </div>
    </div>
  );
};

export default TdeeResultBox;
