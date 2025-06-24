import React from "react";
import { Table } from "antd";

const MealTable = ({ meals = [] }) => {
  const getAmountStyle = (category) => ({
    background:
      category === "protein"
        ? "#e6f7ff"
        : category === "carb"
        ? "#f6ffed"
        : "#fffbe6",
    border:
      category === "protein"
        ? "1px solid #91d5ff"
        : category === "carb"
        ? "1px solid #b7eb8f"
        : "1px solid #ffe58f",
    borderRadius: 4,
    padding: "2px 6px",
    marginLeft: 4,
    display: "inline-block",
  });

  const getMacroStyle = (category) => ({
    display: "inline-block",
    marginTop: 4,
    color:
      category === "protein"
        ? "#cf1322"
        : category === "carb"
        ? "#389e0d"
        : "#d48806",
    border:
      category === "protein"
        ? "1px solid #ffa39e"
        : category === "carb"
        ? "1px solid #95de64"
        : "1px solid #ffd666",
    borderRadius: 4,
    marginLeft: 4,
    padding: "2px 6px",
  });

  const renderFoodColumn = (category) => ({
    title:
      category === "protein"
        ? "🥩 Đạm(g)"
        : category === "carb"
        ? "🍚 Tinh bột(g)"
        : "🥑 Chất béo(g)",
    key: category,

    render: (_, record) => {
      const foods = record.foods?.filter((f) => f.category === category) || [];

      return (
        <div>
          {foods.length > 0 ? (
            foods.map((food, idx) => (
              <div key={`${category}-${idx}`} style={{ marginBottom: 8 }}>
                <strong>{food.label || food.name}</strong>
                <span style={getAmountStyle(category)}>{food.amount}g</span>
                <div style={getMacroStyle(category)}>
                  {category === "protein"
                    ? "Đạm"
                    : category === "carb"
                    ? "Tinh bột"
                    : "Chất béo"}
                  : {food[category].toFixed(1)}g
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#999", fontStyle: "italic" }}>
              Không có thực phẩm
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <strong>
              Tổng:{" "}
              {
                record[
                  `total${category.charAt(0).toUpperCase() + category.slice(1)}`
                ]
              }
              g
            </strong>
          </div>
        </div>
      );
    },
    width: 250,
  });

  const columns = [
    {
      title: "Bữa ăn",
      dataIndex: "mealName",
      key: "mealName",
      width: 120,
      fixed: "left",
    },
    renderFoodColumn("protein"),
    renderFoodColumn("carb"),
    renderFoodColumn("fat"),
    {
      title: "Calo",
      dataIndex: "totalCalories",
      key: "calories",
      width: 100,
      render: (calories) => <strong>{calories} kcal</strong>,
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={meals}
        rowKey="key"
        pagination={false}
        bordered
        scroll={{ x: 600 }}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default MealTable;
