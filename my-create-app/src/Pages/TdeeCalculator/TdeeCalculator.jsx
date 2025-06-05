import React, { useState } from "react";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import Contact from "../../components/Contact/Contact";
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
  });

  const [errors, setErrors] = useState({});
  const [tdee, setTdee] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [macroSet, setMacroSet] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { gender, height, weight, age, activity, formula, bodyfat } = form;

    let newErrors = {};
    if (!gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (!height) newErrors.height = "Vui lòng nhập chiều cao.";
    if (!weight) newErrors.weight = "Vui lòng nhập cân nặng.";
    if (!age) newErrors.age = "Vui lòng nhập tuổi.";
    if (!activity) newErrors.activity = "Vui lòng chọn mức độ hoạt động.";
    if (!formula) newErrors.formula = "Vui lòng chọn công thức.";
    if (formula === "Katch-McArdle" && !bodyfat)
      newErrors.bodyfat = "Vui lòng nhập body fat (%).";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTdee(null);
      setBmr(null);
      return;
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    const act = parseFloat(activity);

    let calculatedBmr = 0;
    if (formula === "Mifflin-St Jeor") {
      calculatedBmr = 10 * w + 6.25 * h - 5 * a + (gender === "Nam" ? 5 : -161);
    } else if (formula === "Katch-McArdle") {
      const bf = parseFloat(bodyfat) / 100;
      const leanMass = w * (1 - bf);
      calculatedBmr = 370 + 21.6 * leanMass;
    }

    const calculatedTdee = Math.round(calculatedBmr * act);
    setBmr(Math.round(calculatedBmr));
    setTdee(calculatedTdee);
    setMacroSet(null);
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
    });
    setTdee(null);
    setBmr(null);
    setErrors({});
    setMacroSet(null);
  };

  const calculateMacro = () => {
    if (!tdee) return;

    const plans = {
      "Low-carb": { protein: 0.4, fat: 0.4, carb: 0.2 },
      "Moderate-carb ": { protein: 0.3, fat: 0.35, carb: 0.35 },
      "High-carb": { protein: 0.3, fat: 0.2, carb: 0.5 },
    };

    const results = {};
    for (const [goal, ratio] of Object.entries(plans)) {
      const pCal = tdee * ratio.protein;
      const cCal = tdee * ratio.carb;
      const fCal = tdee * ratio.fat;
      results[goal] = {
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

          <form
            className="tdee-form"
            onSubmit={handleSubmit}
            onReset={handleReset}
          >
            <div className="form-grid">
              <div className="form-group">
                <label>Giới tính:</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">------</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.gender && (
                  <p className="error-message">{errors.gender}</p>
                )}
              </div>

              <div className="form-group">
                <label>Chiều cao (cm):</label>
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                />
                {errors.height && (
                  <p className="error-message">{errors.height}</p>
                )}
              </div>

              <div className="form-group">
                <label>Cân nặng (kg):</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                />
                {errors.weight && (
                  <p className="error-message">{errors.weight}</p>
                )}
              </div>

              <div className="form-group">
                <label>Tuổi:</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />
                {errors.age && <p className="error-message">{errors.age}</p>}
              </div>

              <div className="form-group">
                <label>Hệ số vận động:</label>
                <select
                  name="activity"
                  value={form.activity}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn mức độ --</option>
                  <option value="1.2">Ít vận động</option>
                  <option value="1.375">Vận động nhẹ (1–3 buổi/tuần)</option>
                  <option value="1.55">Vận động phải (3–5 buổi/tuần)</option>
                  <option value="1.725">Vận động nhiều (6–7 buổi/tuần)</option>
                  <option value="1.9">Vận động rất nhiều (2 buổi/ngày)</option>
                </select>
                {errors.activity && (
                  <p className="error-message">{errors.activity}</p>
                )}
              </div>

              <div className="form-group">
                <label>Tính theo:</label>
                <select
                  name="formula"
                  value={form.formula}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn công thức --</option>
                  <option value="Mifflin-St Jeor">Mifflin-St Jeor</option>
                  <option value="Katch-McArdle">Katch-McArdle</option>
                </select>
                {errors.formula && (
                  <p className="error-message">{errors.formula}</p>
                )}
              </div>

              {form.formula === "Katch-McArdle" && (
                <div className="form-group">
                  <label>Body Fat (%):</label>
                  <input
                    type="number"
                    name="bodyfat"
                    value={form.bodyfat}
                    onChange={handleChange}
                  />
                  {errors.bodyfat && (
                    <p className="error-message">{errors.bodyfat}</p>
                  )}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Xem kết quả
              </button>
              <button type="reset" className="btn btn-outline">
                Đặt lại
              </button>
            </div>

            {tdee && bmr && (
              <div className="tdee-result-box">
                <div className="result-card">
                  <h4>TDEE của bạn:</h4>
                  <div className="value">
                    {tdee}
                    <span> kcal/ngày</span>
                  </div>
                </div>
                <div className="result-card">
                  <h4>BMR của bạn:</h4>
                  <div className="value">
                    {bmr}
                    <span> kcal/ngày</span>
                  </div>
                </div>
                <div className="result-card">
                  <h4>Lượng calo cần thiết:</h4>
                  <div className="value">
                    {tdee}
                    <span> kcal/ngày</span>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="tdee-description">
            <h3>TDEE là gì?</h3>
            <p>
              TDEE (Total Daily Energy Expenditure) là tổng năng lượng bạn tiêu
              hao trong một ngày, bao gồm các hoạt động sống cơ bản (BMR), vận
              động và tiêu hao do tiêu hóa thức ăn. Biết được TDEE giúp bạn điều
              chỉnh chế độ ăn và luyện tập để đạt được mục tiêu giảm cân, duy
              trì hoặc tăng cân một cách khoa học.
            </p>
          </div>

          <div className="tdee-info-section">
            <h3>2. Lịch ăn cụ thể sẽ như thế nào?</h3>
            <p>
              khi đã biết được tổng năng lượng cả ngày bạn cần bước tiếp theo là
              xác định các chất đa lượng <strong>(marco)</strong> .Có 3 nhóm
              chất đa lượng là đạm (Protein), tinh bột (Carb) và chất béo (Fat).
              Bạn có muốn mình tính lượng <strong>Protein, Carb, Fat </strong>
              dựa trên thông số trên của bạn không?
            </p>
            <button onClick={calculateMacro} className="btn btn-primary">
              Xem kết quả
            </button>

            {macroSet && (
              <div className="macro-table">
                {Object.entries(macroSet).map(([goal, values]) => (
                  <div className="macro-card" key={goal}>
                    <h4>{goal}</h4>
                    <div className="macro-row">
                      <strong>{values.protein}g</strong>
                      <span>protein</span>
                    </div>
                    <div className="macro-row">
                      <strong>{values.fat}g</strong>
                      <span>fats</span>
                    </div>
                    <div className="macro-row">
                      <strong>{values.carb}g</strong>
                      <span>carbs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Contact />
      <FooterMinimal />
    </>
  );
};

export default TdeeCalculator;
