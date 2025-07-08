import { useEffect, useState } from "react";
import { message } from "antd";

export const useFoodDatabase = () => {
  const [foodDatabase, setFoodDatabase] = useState([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoadingFoods(true);
      try {
        const response = await fetch(
          "https://htcoaching-backend-1.onrender.com/api/foods"
        );
        const data = await response.json();
        const processed = data.map((food) => ({
          ...food,
          type:
            (food.protein || 0) > (food.carb || 0) &&
            (food.protein || 0) > (food.fat || 0)
              ? "protein"
              : (food.carb || 0) > (food.fat || 0)
              ? "carb"
              : "fat",
        }));
        setFoodDatabase(processed);
      } catch {
        message.error("Lỗi khi tải danh sách thực phẩm");
      } finally {
        setIsLoadingFoods(false);
      }
    };
    fetchFoods();
  }, []);

  return { foodDatabase, isLoadingFoods };
};
