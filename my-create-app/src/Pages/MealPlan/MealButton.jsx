import React from "react";
import { Button } from "antd";

const MealButton = ({ onGenerate, isGenerating, disabled }) => {
  return (
    <div style={{ textAlign: "center", margin: "24px 0" }}>
      <Button
        type="primary"
        size="large"
        onClick={onGenerate}
        loading={isGenerating}
        disabled={disabled}
        style={{ minWidth: 200 }}
      >
        {isGenerating ? "Đang tạo..." : "Gợi ý thực đơn mẫu"}
      </Button>
    </div>
  );
};

export default MealButton;
