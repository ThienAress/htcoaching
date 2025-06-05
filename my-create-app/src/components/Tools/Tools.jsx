import React from "react";
import { Link } from "react-router-dom";
import "./Tools.css";
const Tools = () => {
  return (
    <section className="tools">
      <div className="container">
        <div className="tools-overlay">
          <h2 className="tools-title title">CÔNG CỤ MIỄN PHÍ</h2>

          <div className="tool-highlight">
            <div className="tool-content">
              <h3>Đo lượng mức tiêu thụ năng lượng mỗi ngày (TDEE)</h3>
              <p>
                Khám phá lượng calo cơ thể bạn đốt mỗi ngày để tối ưu hóa việc
                tăng/giảm cân một cách khoa học.
              </p>
              <a href="/tdee-calculator" className="btn btn-primary">
                Khám phá ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tools;
