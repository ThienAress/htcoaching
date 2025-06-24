import { useState } from "react";
import { message } from "antd";

export const useMealGenerator = ({
  selectedPlan,
  selectedMacroPlan,
  macroSet,
  foodDatabase,
}) => {
  const [meals, setMeals] = useState([]);
  const [totalMacros, setTotalMacros] = useState({
    protein: 0,
    carb: 0,
    fat: 0,
  });
  const [totalCalories, setTotalCalories] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const classifyFood = (food) => {
    const total = food.protein + food.carb + food.fat;
    const ratios = {
      protein: food.protein / total,
      carb: food.carb / total,
      fat: food.fat / total,
    };

    // Ngưỡng phân loại rõ ràng
    if (ratios.protein >= 0.6) return "protein";
    if (ratios.carb >= 0.6) return "carb";
    if (ratios.fat >= 0.6) return "fat";

    // Nếu không rõ ràng thì xếp vào nhóm có tỷ lệ cao nhất
    return Object.keys(ratios).reduce((a, b) =>
      ratios[a] > ratios[b] ? a : b
    );
  };

  const generateMeals = () => {
    if (!selectedMacroPlan || !macroSet?.[selectedMacroPlan]) {
      return message.warning("Vui lòng chọn chế độ dinh dưỡng trước");
    }

    try {
      setIsGenerating(true);
      const target = macroSet[selectedMacroPlan];

      // Phân loại thực phẩm
      const foodByCategory = {
        protein: [],
        carb: [],
        fat: [],
      };

      foodDatabase.forEach((food) => {
        const category = classifyFood(food);
        foodByCategory[category].push(food);
      });

      const mealsResult = [];
      let remainingMacros = { ...target };

      for (let i = 0; i < selectedPlan; i++) {
        const mealProteinTarget = remainingMacros.protein / (selectedPlan - i);
        const mealCarbTarget = remainingMacros.carb / (selectedPlan - i);
        const mealFatTarget = remainingMacros.fat / (selectedPlan - i);

        // Hàm chọn thực phẩm
        const selectFoods = (category, targetAmount) => {
          const foods = [...foodByCategory[category]].sort(
            () => 0.5 - Math.random()
          );
          const selected = [];
          let currentAmount = 0;

          for (const food of foods) {
            if (currentAmount >= targetAmount) break;

            const macroValue = food[category];
            let amount = Math.round(
              ((targetAmount - currentAmount) * 100) / macroValue
            );
            amount = Math.min(amount, 200); // Giới hạn tối đa

            if (amount < 5) continue; // Bỏ qua lượng quá nhỏ

            const nutrition = {
              ...food,
              amount,
              [category]: (macroValue * amount) / 100, // Chỉ lưu macro chính
            };

            selected.push(nutrition);
            currentAmount += nutrition[category];
          }

          return selected;
        };

        const proteinFoods = selectFoods("protein", mealProteinTarget);
        const carbFoods = selectFoods("carb", mealCarbTarget);
        const fatFoods = selectFoods("fat", mealFatTarget);

        // Tính tổng dinh dưỡng (chỉ tính macro chính)
        const sumMacro = (foods, type) =>
          foods.reduce((sum, food) => sum + food[type], 0);

        const totalProtein = sumMacro(proteinFoods, "protein");
        const totalCarb = sumMacro(carbFoods, "carb");
        const totalFat = sumMacro(fatFoods, "fat");

        // Tính calories từ tổng macro (chính xác)
        const totalCalories = Math.round(
          totalProtein * 4 + totalCarb * 4 + totalFat * 9
        );

        // Cập nhật macro còn lại
        remainingMacros.protein -= totalProtein;
        remainingMacros.carb -= totalCarb;
        remainingMacros.fat -= totalFat;

        mealsResult.push({
          mealName: `Bữa ${i + 1}`,
          key: `meal-${i + 1}`,
          foods: [
            ...proteinFoods.map((f) => ({ ...f, category: "protein" })),
            ...carbFoods.map((f) => ({ ...f, category: "carb" })),
            ...fatFoods.map((f) => ({ ...f, category: "fat" })),
          ],
          totalProtein: Math.round(totalProtein),
          totalCarb: Math.round(totalCarb),
          totalFat: Math.round(totalFat),
          totalCalories: totalCalories,
        });
      }

      // Tính tổng dinh dưỡng cuối cùng
      const total = mealsResult.reduce(
        (acc, meal) => ({
          protein: acc.protein + meal.totalProtein,
          carb: acc.carb + meal.totalCarb,
          fat: acc.fat + meal.totalFat,
          calories: acc.calories + meal.totalCalories,
        }),
        { protein: 0, carb: 0, fat: 0, calories: 0 }
      );

      setMeals(mealsResult);
      setTotalMacros({
        protein: Math.round(total.protein),
        carb: Math.round(total.carb),
        fat: Math.round(total.fat),
      });
      setTotalCalories(Math.round(total.calories));

      message.success("Tạo thực đơn thành công!");
    } catch (err) {
      console.error(err);
      message.error("Lỗi tạo thực đơn: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMeals,
    meals,
    totalMacros,
    totalCalories,
    isGenerating,
  };
};
