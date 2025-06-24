import { useEffect, useState } from "react";
import { message } from "antd";

export const useMacroSet = () => {
  const [macroSet, setMacroSet] = useState(null);
  const [selectedMacroPlan, setSelectedMacroPlan] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("macroSet");
    if (data) {
      const parsedData = JSON.parse(data);
      Object.keys(parsedData).forEach((plan) => {
        const { protein, carb, fat } = parsedData[plan];
        parsedData[plan].calories = protein * 4 + carb * 4 + fat * 9;
      });
      setMacroSet(parsedData);
    } else {
      message.warning("Vui lòng tính TDEE trước khi sử dụng tính năng này");
    }
  }, []);

  return { macroSet, selectedMacroPlan, setSelectedMacroPlan };
};
