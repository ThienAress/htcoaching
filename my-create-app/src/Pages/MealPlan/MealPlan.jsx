import React, { useState } from "react";
import { Tabs, Table, Tag, Row, Col, Input, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import ChatIcons from "../../components/ChatIcons/ChatIcons";
import Contact from "../../components/Contact/Contact";
import MealSelector from "../../Pages/MealPlan/MealSelector";
import MealButton from "../../Pages/MealPlan/MealButton";
import MealTable from "../../Pages/MealPlan/MealTable";
import MealSummary from "../../Pages/MealPlan/MealSummary";
import NutritionLegend from "../../Pages/MealPlan/NutritionLegend";
import FoodNutritionTable from "../../Pages/MealPlan/FoodNutritionTable";
import { useMacroSet } from "../../hook/useMacroSet";
import { useFoodDatabase } from "../../hook/useFoodDatabase";
import { useMealGenerator } from "../../hook/useMealGenerator";

import "./MealPlan.css";

const { TabPane } = Tabs;

const MealPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(3);
  const { macroSet, selectedMacroPlan, setSelectedMacroPlan } = useMacroSet();
  const { foodDatabase, isLoadingFoods } = useFoodDatabase();
  const { generateMeals, meals, totalMacros, totalCalories, isGenerating } =
    useMealGenerator({
      selectedPlan,
      selectedMacroPlan,
      macroSet,
      foodDatabase,
    });

  return (
    <div className="mealplan-page">
      <HeaderMinimal />
      <div className="meal-container">
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          <span role="img" aria-label="fork">
            🍴
          </span>{" "}
          THỰC ĐƠN CỦA BẠN
        </h2>

        <MealSelector
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          macroSet={macroSet}
          selectedMacroPlan={selectedMacroPlan}
          setSelectedMacroPlan={setSelectedMacroPlan}
        />

        <MealButton
          onGenerate={generateMeals}
          isGenerating={isGenerating}
          disabled={!selectedMacroPlan || isLoadingFoods}
        />

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Thực đơn gợi ý",
              children: (
                <>
                  <MealTable meals={meals} />
                  {meals.length > 0 && (
                    <>
                      <NutritionLegend />
                      <MealSummary
                        totalMacros={totalMacros}
                        totalCalories={totalCalories}
                        macroSet={macroSet}
                        selectedMacroPlan={selectedMacroPlan}
                      />
                    </>
                  )}
                </>
              ),
            },
            {
              key: "2",
              label: "Bảng dinh dưỡng thực phẩm",
              children: <FoodNutritionTable foodDatabase={foodDatabase} />,
            },
          ]}
        />
      </div>
      <ChatIcons />
      <Contact />
      <FooterMinimal />
    </div>
  );
};

export default MealPlan;
