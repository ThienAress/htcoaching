import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RegisterPage.css";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import ChatIcon from "../../components/ChatIcons/ChatIcons";
import { useUser } from "../../UserContent/UserContext";

function RegisterPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage;
  const planMode = state?.planMode;
  const originalPrice = state?.originalPrice || 0;
  const discount = state?.discount || 0;
  const total = state?.total || 0;
  const { user } = useUser();
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [isNoteHintHovered, setIsNoteHintHovered] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSchedule, setNewSchedule] = useState({ day: "", time: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: user?.email || "",
    note: "",
    location: "WAYSTATION DÂN CHỦ",
    schedule: [],
  });

  const containsProhibitedContent = (text) => {
    const badWords = [
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

    const scriptRegex = /<script.*?>.*?<\/script>/gis;
    const domainRegex =
      /(https?:\/\/)?[a-z0-9.-]*(rakhoi|sv388|win88|cmd368|fun88|go88|f8bet|esball|ae888|123win|789win|hi88|okvip|new88|w88|m88|b52|uw88|nổhũ|bàiđổithưởng|cáđộ|cá cược)[^\s]*/gi;

    const lowered = text.toLowerCase();

    return (
      badWords.some((word) => lowered.includes(word)) ||
      domainRegex.test(lowered) ||
      scriptRegex.test(text)
    );
  };

  useEffect(() => {
    if (!selectedPackage || !planMode) {
      navigate("/", { replace: true });
    }
  }, [selectedPackage, planMode, navigate]);

  if (!selectedPackage || !planMode) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 8) {
      newErrors.name = "Họ và tên phải có ít nhất 8 ký tự";
    }
    if (!formData.phone.match(/^[0-9]{10}$/)) {
      newErrors.phone = "Số điện thoại phải đúng 10 chữ số";
    }
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      newErrors.email = "Email phải đúng định dạng @gmail.com";
    }
    if (!formData.note.trim() || formData.note.length < 8) {
      newErrors.note = "Thông tin bổ sung phải có ít nhất 8 ký tự";
    } else if (containsProhibitedContent(formData.note)) {
      newErrors.note = "Thông tin chứa từ ngữ hoặc nội dung không phù hợp!";
    }
    if (formData.schedule.length === 0) {
      newErrors.schedule = "Vui lòng thêm ít nhất 1 thời gian tập luyện.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSchedule = () => {
    if (!newSchedule.day || !newSchedule.time) return;
    setFormData({
      ...formData,
      schedule: [...formData.schedule, newSchedule],
    });
    setNewSchedule({ day: "", time: "" });
  };

  const handleRemoveSchedule = (index) => {
    const updated = [...formData.schedule];
    updated.splice(index, 1);
    setFormData({ ...formData, schedule: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    navigate("/payment", {
      state: {
        formData: {
          ...formData,
          uid: user?.uid || null,
        },
        selectedPackage,
        planMode,
        originalPrice,
        discount,
        total,
      },
    });
  };

  const timeOptions = Array.from({ length: 17 }, (_, i) => {
    const hour = 7 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <>
      <HeaderMinimal />
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>THÔNG TIN THANH TOÁN</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Họ và tên *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label>Số điện thoại *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const input = e.target.value;
                if (/^[0-9]*$/.test(input)) {
                  setFormData({ ...formData, phone: input });
                }
              }}
              maxLength={10}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label>Phòng tập mình đang dạy *</label>
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            >
              <option value="">-- Chọn phòng tập --</option>
              <option>WAYSTATION DÂN CHỦ</option>
              <option>WAYSTATION TRƯƠNG VĂN HẢI</option>
              <option>WAYSTATION HIỆP BÌNH</option>
              <option>WAYSTATION QL13</option>
              <option>Chung CƯ Flora Novia</option>
            </select>

            <label>Thời gian tập luyện của bạn *</label>
            <div className="schedule-input-row">
              <select
                value={newSchedule.day}
                onChange={(e) =>
                  setNewSchedule((prev) => ({ ...prev, day: e.target.value }))
                }
              >
                <option value="">-- Chọn ngày --</option>
                <option>Thứ 2</option>
                <option>Thứ 3</option>
                <option>Thứ 4</option>
                <option>Thứ 5</option>
                <option>Thứ 6</option>
                <option>Thứ 7</option>
                <option>Chủ nhật</option>
              </select>
              <select
                value={newSchedule.time}
                onChange={(e) =>
                  setNewSchedule((prev) => ({ ...prev, time: e.target.value }))
                }
              >
                <option value="">-- Chọn giờ --</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddSchedule}
                className="order-button"
                style={{ maxWidth: "180px" }}
              >
                + Thêm thời gian
              </button>
            </div>
            {formData.schedule.map((item, i) => (
              <div key={i} className="schedule-display">
                - {item.day} lúc {item.time}
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(i)}
                  className="remove-btn"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
            {errors.schedule && (
              <span className="error">{errors.schedule}</span>
            )}

            <label>Thông tin bổ sung</label>
            <textarea
              rows={4}
              placeholder="Ghi chú bắt buộc (ví dụ: địa điểm mong muốn, để lại link fb, zalo hoặc sđt để bên mình tiện trao đổi nha...)"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              onFocus={() => setIsNoteFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  if (!isNoteHintHovered) {
                    setIsNoteFocused(false);
                  }
                }, 100);
              }}
            />
            {errors.note && <span className="error">{errors.note}</span>}
            {(isNoteFocused || isNoteHintHovered) && (
              <small
                className="hint"
                onMouseEnter={() => setIsNoteHintHovered(true)}
                onMouseLeave={() => setIsNoteHintHovered(false)}
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
            <button type="submit" className="order-button">
              ĐẶT HÀNG
            </button>
          </form>
        </div>

        <div className="checkout-right">
          <h3>ĐƠN HÀNG CỦA BẠN</h3>
          <div className="order-summary">
            <p>
              Sản phẩm:{" "}
              <strong>
                {planMode} ({selectedPackage.title})
              </strong>
            </p>
            <p>Tạm tính: {originalPrice.toLocaleString()}đ</p>
            {discount > 0 && (
              <p>
                Giảm giá 15%:{" "}
                <span className="register-discount">
                  -{discount.toLocaleString()}đ
                </span>
              </p>
            )}
            <hr />
            <p>
              <strong>Tổng cộng: {total.toLocaleString()}đ</strong>
            </p>
            <p>Thanh toán chuyển khoản</p>
          </div>
          <p className="note">
            Thông tin của bạn sẽ được dùng để xử lý đơn hàng theo chính sách bảo
            mật của chúng tôi.
          </p>
        </div>
      </div>

      <ChatIcon />
      <FooterMinimal />
    </>
  );
}

export default RegisterPage;
