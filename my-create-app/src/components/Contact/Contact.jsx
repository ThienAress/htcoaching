import { useState, useEffect } from "react";
import "./Contact.css";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    social: "",
    package: "",
  });

  const forbiddenKeywords = [
    // 🔞 Tục tĩu, khiêu dâm, chửi thề
    "địt",
    "dit",
    "đụ",
    "du",
    "đụ má",
    "đụ mẹ",
    "đm",
    "dm",
    "dmm",
    "dcm",
    "cặc",
    "cak",
    "cac",
    "cạc",
    "lồn",
    "lon",
    "loz",
    "l",
    "buồi",
    "buoi",
    "bùi",
    "bui",
    "chim",
    "bướm",
    "buom",
    "bú",
    "bu",
    "bú lol",
    "bú l",
    "ăn cặc",
    "ăn l",
    "ăn buồi",
    "đéo",
    "deo",
    "đếch",
    "dek",
    "vl",
    "vkl",
    "cl",
    "vcl",
    "cc",
    "shit",
    "fuck",
    "fml",
    "diss",
    "bitch",
    "bóp vú",
    "nứng",
    "nứng lồn",
    "nứng vl",
    "chịch",
    "chich",
    "xoạc",
    "xoc",
    "rape",
    "hiếp",
    "hiếp dâm",
    "gạ tình",
    "gạ gẫm",
    "sex",
    "sexy",
    "69",
    "xxx",
    "jav",
    "phim sex",
    "phim jav",
    "trai gọi",
    "gái gọi",
    "gái mại dâm",
    "bán dâm",
    "đi khách",

    // 🎰 Link cá cược, nhà cái, cờ bạc
    "bong",
    "casino",
    "bet",
    "ku",
    "cmd368",
    "w88",
    "fun88",
    "fifa",
    "letou",
    "cacuoc",
    "1xbet",
    "dafabet",
    "188bet",
    "m88",
    "baccarat",
    "xoso",
    "xổ số",
    "danh bai",
    "game bai",
    "rakhoi",
    "choi casino",
    "vn88",
    "bong88",
    "new88",
    "nhacaionline",
    "nhà cái",

    // 🧨 Viết tắt lách luật / tiếng lóng phổ biến
    "fck",
    "f u",
    "dmml",
    "dmvl",
    "ml",
    "ccmm",
    "đkm",
    "bố mày",
    "mẹ mày",
    "con đĩ",
    "con chó",
    "thằng chó",
    "clgt",
    "clmm",
    "sv",
    "óc chó",
    "súc vật",
    "não chó",
  ];

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSocialFocused, setIsSocialFocused] = useState(false);
  const [isHintHovered, setIsHintHovered] = useState(false);

  // Ngăn cuộn và đóng popup sau 5s
  useEffect(() => {
    let timer;
    let interval;

    if (showSuccess) {
      document.body.style.overflow = "hidden";
      setCountdown(5);

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
    if (!formData.email.match(/^[\w.+-]+@gmail\.com$/)) {
      newErrors.email = "Email phải đúng định dạng @gmail.com";
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = "Số điện thoại phải đúng 10 số";
    }
    if (!formData.social) {
      newErrors.social = "Vui lòng nhập Facebook/Zalo";
    } else if (formData.social.length > 50) {
      newErrors.social = "Tối đa 50 ký tự";
    } else if (
      /<|>|script|"|'|`|onerror|onload|alert|\(|\)/i.test(formData.social)
    ) {
      newErrors.social = "Thông tin không hợp lệ";
    } else if (
      forbiddenKeywords.some((kw) => formData.social.toLowerCase().includes(kw))
    ) {
      newErrors.social = "Thông tin chứa ngôn từ không phù hợp!";
    } else if (
      /bong|casino|bet|ku\d+|cmd368|w88|fun88|fifa|letou|cacuoc|1xbet|dafabet|188bet|m88|baccarat|xoso|xổ\s*số|danh\s*bai|game\s*bai/i.test(
        formData.social
      )
    ) {
      newErrors.social = "Không chấp nhận link cá cược/bài bạc!";
    } else if (
      !/^https:\/\/(www\.facebook\.com\/[A-Za-z0-9.]+|zalo\.me\/\d{8,15})$/.test(
        formData.social
      )
    ) {
      newErrors.social = "Chỉ cho phép link Facebook hoặc Zalo hợp lệ!";
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
      // Tạo ID ngẫu nhiên không cần truy vấn Firestore trước
      const randomId = Math.random().toString(36).substring(2, 15);
      const newId = `lienhe_khachhang_${Date.now()}_${randomId}`;

      // Ghi dữ liệu với ID tự tạo
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
                onFocus={() => setIsSocialFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    if (!isHintHovered) {
                      setIsSocialFocused(false);
                    }
                  }, 100);
                }}
              />
              {errors.social && <span className="error">{errors.social}</span>}
              {(isSocialFocused || isHintHovered) && (
                <small
                  className="hint"
                  onMouseEnter={() => setIsHintHovered(true)}
                  onMouseLeave={() => setIsHintHovered(false)}
                >
                  VD: Link Facebook như của mình sau:{" "}
                  <span className="example">
                    https://www.facebook.com/thienvo123456
                  </span>
                  , hoặc copy mẫu Zalo:{" "}
                  <span className="example">https://zalo.me/0934215227</span> và
                  đổi số điện thoại của bạn.
                </small>
              )}
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
                <option value="Gói trial">TRIAL</option>
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
