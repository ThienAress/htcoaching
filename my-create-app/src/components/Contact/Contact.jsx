import { useState, useEffect } from "react";
import "./Contact.css";
import { db } from "../../firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    social: "",
    package: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  // Ngăn cuộn và đóng popup sau 5s
  useEffect(() => {
    let timer;
    let interval;

    if (showSuccess) {
      document.body.style.overflow = "hidden";
      setCountdown(5); // reset đếm ngược về 5

      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      timer = setTimeout(() => {
        setShowSuccess(false);
        document.body.style.overflow = "auto";
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, [showSuccess]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 8) {
      newErrors.name = "Họ tên phải có ít nhất 8 ký tự";
    }
    if (!formData.email.match(/^[\w.+\-]+@gmail\.com$/)) {
      newErrors.email = "Email phải đúng định dạng @gmail.com";
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = "Số điện thoại phải đúng 10 số";
    }
    if (!formData.social) {
      newErrors.social = "Vui lòng nhập Facebook/Zalo";
    }
    if (!formData.package) {
      newErrors.package = "Vui lòng chọn gói tập quan tâm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const snapshot = await getDocs(collection(db, "lien_he"));

      // Lọc các document có id bắt đầu bằng 'lienhe_khachhang_'
      const existingIds = snapshot.docs
        .map((doc) => doc.data().id)
        .filter((id) => /^lienhe_khachhang_\d+$/.test(id));

      // Lấy số thứ tự lớn nhất
      const maxNumber = existingIds.reduce((max, id) => {
        const num = parseInt(id.split("_").pop(), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);

      // Tạo id mới
      const newId = `lienhe_khachhang_${maxNumber + 1}`;

      // Ghi dữ liệu với ID tuỳ chỉnh (setDoc thay cho addDoc)
      await setDoc(doc(db, "lien_he", newId), {
        ...formData,
        id: newId,
        dateTime: new Date(),
        state: "pending",
      });

      // Reset form và hiện popup
      setFormData({
        name: "",
        email: "",
        phone: "",
        social: "",
        package: "",
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Lỗi gửi thông tin:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  return (
    <section id="contact" className="contact">
      <div className="container">
        {showSuccess && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>✔ Gửi thông tin thành công!</h3>
              <p>
                Tư vấn viên sẽ liên hệ với bạn trong thời gian sớm nhất. <br />
                Popup sẽ tự động đóng sau: <strong>{countdown} giây</strong>
              </p>
            </div>
          </div>
        )}

        <div className="contact-content">
          <h2 className="section-title">Liên hệ với chúng tôi</h2>
          <p>Để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí cho bạn</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                placeholder="Số điện thoại"
                maxLength="10"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setFormData({ ...formData, phone: val });
                  }
                }}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Trang cá nhân FB or ZALO"
                value={formData.social}
                onChange={(e) =>
                  setFormData({ ...formData, social: e.target.value })
                }
              />
              {errors.social && <span className="error">{errors.social}</span>}
            </div>

            <div className="form-group">
              <select
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
              >
                <option value="" disabled>
                  Chọn gói tập quan tâm
                </option>
                <option value="Gói cơ bản">ONLINE</option>
                <option value="Gói nâng cao">1-1</option>
              </select>
              {errors.package && (
                <span className="error">{errors.package}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Gửi thông tin
            </button>
          </form>
        </div>

        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Tùy vào phòng tập bạn chọn</p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone-alt"></i>
            <p>0934.215.227</p>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <p>hoangthiengym99@gmail.com</p>
          </div>
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <p>Thứ 2 - Chủ nhật: 6:00 - 22:00</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
