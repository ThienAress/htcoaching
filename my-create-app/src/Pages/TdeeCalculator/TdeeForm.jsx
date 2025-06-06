import React from "react";

const TdeeForm = ({
  form,
  errors,
  handleChange,
  handleSubmit,
  handleReset,
  goalNotice,
}) => {
  return (
    <form className="tdee-form" onSubmit={handleSubmit} onReset={handleReset}>
      <div className="form-grid">
        {/* Giới tính */}
        <div className="form-group">
          <label>Giới tính:</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">------</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>

        {/* Chiều cao */}
        <div className="form-group">
          <label>Chiều cao (cm):</label>
          <input
            type="number"
            name="height"
            min="0"
            value={form.height}
            onChange={handleChange}
          />
          {errors.height && <p className="error-message">{errors.height}</p>}
        </div>

        {/* Cân nặng */}
        <div className="form-group">
          <label>Cân nặng (kg):</label>
          <input
            type="number"
            name="weight"
            min="0"
            value={form.weight}
            onChange={handleChange}
          />
          {errors.weight && <p className="error-message">{errors.weight}</p>}
        </div>

        {/* Tuổi */}
        <div className="form-group">
          <label>Tuổi:</label>
          <input
            type="number"
            name="age"
            min="0"
            value={form.age}
            onChange={handleChange}
          />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>

        {/* Mức vận động */}
        <div className="form-group">
          <label>Hệ số vận động:</label>
          <select name="activity" value={form.activity} onChange={handleChange}>
            <option value="">-- Chọn mức độ --</option>
            <option value="1.2">Ít vận động</option>
            <option value="1.375">Vận động nhẹ (1–3 buổi/tuần)</option>
            <option value="1.55">Vận động vừa (3–5 buổi/tuần)</option>
            <option value="1.725">Vận động nhiều (6–7 buổi/tuần)</option>
            <option value="1.9">Vận động rất nhiều (2 buổi/ngày)</option>
          </select>
          {errors.activity && (
            <p className="error-message">{errors.activity}</p>
          )}
        </div>

        {/* Công thức */}
        <div className="form-group">
          <label>Tính theo:</label>
          <select name="formula" value={form.formula} onChange={handleChange}>
            <option value="">-- Chọn công thức --</option>
            <option value="Mifflin-St Jeor">Mifflin-St Jeor</option>
            <option value="Katch-McArdle">Katch-McArdle</option>
          </select>
          {errors.formula && <p className="error-message">{errors.formula}</p>}
        </div>

        {/* Body Fat */}
        {form.formula === "Katch-McArdle" && (
          <div className="form-group">
            <label>Body Fat (%):</label>
            <input
              type="number"
              name="bodyfat"
              min="0"
              value={form.bodyfat}
              onChange={handleChange}
            />
            {errors.bodyfat && (
              <p className="error-message">{errors.bodyfat}</p>
            )}
          </div>
        )}

        {/* Mục tiêu */}
        <div className="form-group">
          <label>Mục tiêu của bạn:</label>
          <select
            name="goal"
            value={form.goal}
            onChange={(e) => {
              const prev = form.goal;
              handleChange(e);
              if (prev && prev !== e.target.value) goalNotice(true);
              else goalNotice(false);
            }}
          >
            <option value="">-- Chọn mục tiêu --</option>
            <option value="gain">Tăng cơ</option>
            <option value="lose">Giảm mỡ</option>
            <option value="maintain">Duy trì</option>
          </select>
          {goalNotice && (
            <p className="goal-notice">
              Bạn đã thay đổi mục tiêu. Hãy bấm lại vào nút "Xem kết quả" để cập
              nhật.
            </p>
          )}
          {errors.goal && <p className="error-message">{errors.goal}</p>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Xem kết quả
        </button>
        <button type="reset" className="btn btn-outline">
          Đặt lại
        </button>
      </div>
    </form>
  );
};

export default TdeeForm;
