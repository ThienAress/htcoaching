import ClassCard from "./ClassCard";
import "./Classes.css";
function Classes() {
  return (
    <section className="classes" id="classes">
      <div className="container">
        <h2 className="classes-title title" data-aos="fade-down">
          CHƯƠNG TRÌNH ĐÀO TẠO TRỰC TIẾP
        </h2>
        <p className="classes-subtitle desc" data-aos="fade-down">
          Cùng tôi chinh phục mục tiêu thể chất với 3 bộ môn đặc trưng
        </p>
        <div className="classes-grid" data-aos="flip-down">
          <ClassCard
            image="images/class3.jpg"
            title="Personal Training"
            desc="Huấn luyện 1:1 giúp bạn theo sát tiến độ, tập đúng kỹ thuật và
                đạt mục tiêu nhanh hơn bao giờ hết."
            benefits={[
              "Lộ trình cá nhân hóa",
              "Tập trung vào mục tiêu riêng của bạn",
              "An toàn - Hiệu quả tối ưu",
            ]}
          />
          <ClassCard
            image="images/class2.jpg"
            title="Cardio & HIIT"
            desc=" Đốt cháy mỡ thừa hiệu quả, tăng nhịp tim và cải thiện sức bền
                chỉ trong vài phút mỗi buổi tập."
            benefits={[
              "Bài tập ngắn - Hiệu quả vượt trội",
              "Cải thiện sức khỏe tim mạch",
              "Phù hợp với người bận rộn",
            ]}
          />
          <ClassCard
            image="images/class4.jpg"
            title="Boxing"
            desc="Tăng sức bền, cải thiện phản xạ và giải phóng căng thẳng với
                những bài tập đầy năng lượng."
            benefits={[
              "Đốt mỡ, săn chắc toàn thân",
              "Nâng cao phản xạ và sự tự tin",
              "Giải phóng năng lượng tiêu cực",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default Classes;
