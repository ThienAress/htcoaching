import React, { useState } from "react";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import Contact from "../../components/Contact/Contact";
import TdeeForm from "./TdeeForm";
import TdeeResultBox from "./TdeeResultBox";
import MacroTable from "./MacroTable";
import "./TdeeCalculator.css";

const TdeeCalculator = () => {
  const [form, setForm] = useState({
    gender: "",
    height: "",
    weight: "",
    age: "",
    activity: "",
    formula: "",
    bodyfat: "",
    goal: "",
  });

  const [errors, setErrors] = useState({});
  const [tdee, setTdee] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [adjustedCalories, setAdjustedCalories] = useState(null);
  const [macroSet, setMacroSet] = useState(null);
  const [goalNotice, setGoalNotice] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name) return;

    if (["height", "weight", "age", "bodyfat"].includes(name) && value < 0)
      return;

    if (name === "goal" && form.goal && form.goal !== value) {
      setGoalNotice(true);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { gender, height, weight, age, activity, formula, bodyfat, goal } =
      form;

    let newErrors = {};
    if (!gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (!height || height <= 0) newErrors.height = "Chiều cao phải lớn hơn 0.";
    if (!weight || weight <= 0) newErrors.weight = "Cân nặng phải lớn hơn 0.";
    if (!age || age <= 0) newErrors.age = "Tuổi phải lớn hơn 0.";
    if (!activity) newErrors.activity = "Vui lòng chọn mức độ hoạt động.";
    if (!formula) newErrors.formula = "Vui lòng chọn công thức.";
    if (!goal) newErrors.goal = "Vui lòng chọn mục tiêu.";
    if (formula === "Katch-McArdle" && (!bodyfat || bodyfat <= 0)) {
      newErrors.bodyfat = "Vui lòng nhập body fat (%).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTdee(null);
      setBmr(null);
      setAdjustedCalories(null);
      return;
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    const act = parseFloat(activity);
    let calculatedBmr = 0;

    if (formula === "Mifflin-St Jeor") {
      calculatedBmr = 10 * w + 6.25 * h - 5 * a + (gender === "Nam" ? 5 : -161);
    } else {
      const bf = parseFloat(bodyfat) / 100;
      const leanMass = w * (1 - bf);
      calculatedBmr = 370 + 21.6 * leanMass;
    }

    const tdeeBase = calculatedBmr * act;
    setBmr(Math.round(calculatedBmr));
    setTdee(Math.round(tdeeBase));

    let adjusted = tdeeBase;
    if (goal === "gain") adjusted += 300;
    else if (goal === "lose") adjusted -= 300;
    setAdjustedCalories(Math.round(adjusted));
    setMacroSet(null);
    setGoalNotice(false);

    setGoalNotice(false);
  };

  const handleReset = () => {
    setForm({
      gender: "",
      height: "",
      weight: "",
      age: "",
      activity: "",
      formula: "",
      bodyfat: "",
      goal: "",
    });
    setTdee(null);
    setBmr(null);
    setAdjustedCalories(null);
    setErrors({});
    setMacroSet(null);
    setGoalNotice(false);
  };

  const calculateMacro = () => {
    if (!adjustedCalories) return;
    const plans = {
      "Low-carb": { protein: 0.4, fat: 0.4, carb: 0.2 },
      "Moderate-carb": { protein: 0.3, fat: 0.35, carb: 0.35 },
      "High-carb": { protein: 0.3, fat: 0.2, carb: 0.5 },
    };

    const results = {};
    for (const [goalName, ratio] of Object.entries(plans)) {
      const pCal = adjustedCalories * ratio.protein;
      const cCal = adjustedCalories * ratio.carb;
      const fCal = adjustedCalories * ratio.fat;
      results[goalName] = {
        protein: Math.round(pCal / 4),
        carb: Math.round(cCal / 4),
        fat: Math.round(fCal / 9),
      };
    }
    setMacroSet(results);
  };

  return (
    <>
      <HeaderMinimal />
      <section className="tdee">
        <div className="container">
          <h2 className="tdee-title">
            ĐO LƯỢNG CALO ĐỐT CHÁY TRONG 1 NGÀY TDEE
          </h2>
          <TdeeForm
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            goalNotice={goalNotice}
            setGoalNotice={setGoalNotice}
          />
          {tdee && bmr && (
            <TdeeResultBox
              tdee={tdee}
              bmr={bmr}
              adjustedCalories={adjustedCalories}
              goal={form.goal}
            />
          )}
          {adjustedCalories && (
            <>
              <div className="tdee-description">
                <h3>TDEE là gì?</h3>
                <p>
                  <strong>TDEE (Total Daily Energy Expenditure)</strong> là tổng
                  năng lượng bạn tiêu hao trong một ngày, bao gồm các hoạt động
                  sống cơ bản (BMR), vận động và tiêu hao do tiêu hóa thức ăn.
                  Biết được TDEE giúp bạn điều chỉnh chế độ ăn và luyện tập để
                  đạt được mục tiêu.
                </p>
              </div>

              <div className="tdee-info-section">
                <h3>2. Lịch ăn cụ thể sẽ như thế nào?</h3>
                <p>
                  Khi đã biết được tổng năng lượng bạn cần, bước tiếp theo là
                  xác định các chất đa lượng <strong>(macros)</strong> bao gồm
                  có:{" "}
                  <strong>
                    {" "}
                    Đạm (Protein), Tinh bột (Carb), Chất béo (Fat)
                  </strong>
                  . Bạn muốn mình tính giúp không?
                </p>
                <button onClick={calculateMacro} className="btn btn-primary">
                  Xem kết quả
                </button>
                {macroSet && (
                  <MacroTable
                    macroSet={macroSet}
                    tdee={tdee}
                    adjustedCalories={adjustedCalories}
                    goal={form.goal}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <Contact />
      <FooterMinimal />
    </>
  );
};

export default TdeeCalculator;
