import React, { useEffect, useState } from "react";
import {
  Select,
  Table,
  Typography,
  Row,
  Col,
  Button,
  message,
  Card,
} from "antd";
import { ForkOutlined } from "@ant-design/icons";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import "./MealPlan.css";

const { Option } = Select;
const { Title } = Typography;

const mealOptions = [3, 4, 5, 6];

const foodDatabase = [
  { label: "Ức gà", value: "chicken", protein: 30, carb: 0, fat: 3 },
  { label: "Gạo lứt", value: "brown_rice", protein: 2.5, carb: 23, fat: 0.9 },
  { label: "Trứng", value: "egg", protein: 6, carb: 0.4, fat: 5 },
  {
    label: "Khoai lang",
    value: "sweet_potato",
    protein: 2,
    carb: 20,
    fat: 0.1,
  },
  { label: "Bông cải", value: "broccoli", protein: 2.8, carb: 6, fat: 0.3 },
  { label: "Cá hồi", value: "salmon", protein: 25, carb: 0, fat: 13 },
];

const MealPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(3);
  const [meals, setMeals] = useState([]);
  const [macroSet, setMacroSet] = useState(null);
  const [selectedMacroPlan, setSelectedMacroPlan] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("macroSet");
    if (data) {
      const parsed = JSON.parse(data);
      setMacroSet(parsed);
    } else {
      message.warning(
        "Không tìm thấy dữ liệu macro. Vui lòng quay lại trang tính TDEE."
      );
    }
  }, []);

  useEffect(() => {
    const defaultMeals = Array.from({ length: selectedPlan }, (_, i) => ({
      key: i + 1,
      mealName: `Bữa ${i + 1}`,
      proteinFood: [],
      carbFood: [],
      fatFood: [],
      otherFood: [],
    }));
    setMeals(defaultMeals);
  }, [selectedPlan]);

  const handleFoodChange = (key, field, value) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.key === key ? { ...meal, [field]: value } : meal
      )
    );
  };

  const columns = [
    {
      title: "🍽️ Bữa ăn",
      key: "meal",
      dataIndex: "mealName",
      width: 100,
      render: (text) => <span className="meal-text">{text}</span>,
    },
    {
      title: "🥩 Đạm (Protein)",
      key: "protein",
      render: (_, record) => (
        <Select
          mode="multiple"
          placeholder="Chọn thực phẩm"
          className="meal-select"
          value={record.proteinFood}
          onChange={(value) =>
            handleFoodChange(record.key, "proteinFood", value)
          }
        >
          {foodDatabase.map((food) => (
            <Option key={food.value} value={food.value} className="meal-option">
              {food.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "🍚 Tinh bột (Carb)",
      key: "carb",
      render: (_, record) => (
        <Select
          mode="multiple"
          placeholder="Chọn thực phẩm"
          className="meal-select"
          value={record.carbFood}
          onChange={(value) => handleFoodChange(record.key, "carbFood", value)}
        >
          {foodDatabase.map((food) => (
            <Option key={food.value} value={food.value} className="meal-option">
              {food.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "🥑 Chất béo (Fat)",
      key: "fat",
      render: (_, record) => (
        <Select
          mode="multiple"
          placeholder="Chọn thực phẩm"
          className="meal-select"
          value={record.fatFood}
          onChange={(value) => handleFoodChange(record.key, "fatFood", value)}
        >
          {foodDatabase.map((food) => (
            <Option key={food.value} value={food.value} className="meal-option">
              {food.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "🍽️ Thực phẩm khác",
      key: "other",
      render: (_, record) => (
        <Select
          mode="multiple"
          placeholder="Chọn thực phẩm"
          className="meal-select"
          value={record.otherFood}
          onChange={(value) => handleFoodChange(record.key, "otherFood", value)}
        >
          {foodDatabase.map((food) => (
            <Option key={food.value} value={food.value} className="meal-option">
              {food.label}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div className="mealplan-page">
      <HeaderMinimal />
      <div className="meal-container">
        <Title level={2} className="meal-title">
          <ForkOutlined className="meal-icon" /> GỢI Ý LỊCH ĂN TUỲ CHỌN
        </Title>

        <Row gutter={[16, 16]} justify="center">
          {macroSet && (
            <Col xs={24} sm={12} md={10} lg={8}>
              <Card size="small" bordered>
                <div className="meal-label">Chọn chế độ macro:</div>
                <Select
                  placeholder="Chọn kế hoạch"
                  value={selectedMacroPlan}
                  onChange={(val) => setSelectedMacroPlan(val)}
                  className="meal-select"
                >
                  {Object.keys(macroSet).map((plan) => (
                    <Option key={plan} value={plan} className="meal-option">
                      {plan}
                    </Option>
                  ))}
                </Select>

                {selectedMacroPlan && macroSet[selectedMacroPlan] && (
                  <div className="macro-summary">
                    <strong>Chỉ tiêu dinh dưỡng:</strong>
                    <div>
                      Đạm:{" "}
                      <strong>{macroSet[selectedMacroPlan].protein}g</strong>{" "}
                    </div>
                    <div>
                      Tinh bột:
                      <strong>{macroSet[selectedMacroPlan].carb}g</strong>{" "}
                    </div>
                    <div>
                      Chất béo:{" "}
                      <strong>{macroSet[selectedMacroPlan].fat}g</strong>
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          )}

          <Col xs={24} sm={12} md={10} lg={8}>
            <Card size="small" bordered>
              <div className="meal-label">Số bữa ăn mỗi ngày:</div>
              <Select
                value={selectedPlan}
                onChange={(val) => setSelectedPlan(val)}
                className="meal-select"
              >
                {mealOptions.map((num) => (
                  <Option key={num} value={num} className="meal-option">
                    {num} bữa
                  </Option>
                ))}
              </Select>
            </Card>
          </Col>
        </Row>

        <div className="meal-table">
          <Table
            dataSource={meals}
            columns={columns}
            pagination={false}
            bordered
            scroll={{ x: true }}
          />
        </div>

        <div className="meal-button">
          <Button
            type="btn btn-primary"
            className="meal-action"
            onClick={() => console.log(meals)}
          >
            Tính toán macros
          </Button>
        </div>
      </div>
      <FooterMinimal />
    </div>
  );
};

export default MealPlan;
