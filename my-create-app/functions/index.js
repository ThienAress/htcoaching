const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();

// Cấu hình gmail gửi mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hoangthiengym99@gmail.com", // Thay bằng email gửi
    pass: "qnch ycbd bqal kwiv", // Mật khẩu ứng dụng Gmail
  },
});

// Hàm gửi email xác nhận khi có checkin mới
exports.sendCheckinMail = onDocumentCreated(
  "checkins/{checkinId}",
  async (event) => {
    try {
      const snap = event.data;
      const data = snap.data();
      if (!data.email) {
        console.log("Không có email, bỏ qua gửi thư");
        return null;
      }

      // Định dạng ngày tập
      let dateStr = "Không xác định";
      try {
        if (data.date) {
          const dateValue = data.date.toDate ? data.date.toDate() : data.date;
          dateStr = dateValue.toLocaleString("vi-VN");
        }
      } catch (e) {
        console.error("Lỗi định dạng ngày tháng:", e);
      }

      // Xử lý nhóm cơ
      let musclesText = "Không xác định";
      if (data.muscles) {
        if (Array.isArray(data.muscles)) {
          musclesText =
            data.muscles.length > 0
              ? data.muscles.join(", ")
              : "Không có thông tin";
        } else if (typeof data.muscles === "string") {
          musclesText = data.muscles;
        }
      }

      // Xử lý remainingSessions
      let remainingSessions = "Không xác định";
      if (typeof data.remainingSessions === "number") {
        remainingSessions = data.remainingSessions.toString();
      } else if (typeof data.remainingSessions === "string") {
        remainingSessions = data.remainingSessions;
      }

      // Nội dung email
      const mailOptions = {
        from: '"HTCoaching" <hoangthiengym99@gmail.com>',
        to: data.email,
        subject: "HTCoaching - Xác nhận lịch tập mới",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h3 style="color: #2c3e50;">Xin chào ${
            data.customerName || "Khách hàng"
          }!</h3>
          <p>Bạn vừa được admin HTCoaching book lịch tập:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 10px;"><b>📅 Ngày tập:</b> ${dateStr}</li>
            <li style="margin-bottom: 10px;"><b>💪 Nhóm cơ:</b> ${musclesText}</li>
            <li style="margin-bottom: 10px;"><b>📝 Ghi chú:</b> ${
              data.note || "Không có"
            }</li>
            <li style="margin-bottom: 10px;"><b>✅ Buổi còn lại:</b> ${remainingSessions}</li>
          </ul>
          <p>Nếu có thắc mắc, vui lòng liên hệ lại trung tâm.</p>
          <p>Chúc bạn tập luyện hiệu quả!</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 0.9em; color: #777;">HTCoaching - Phát triển thể chất toàn diện</p>
        </div>
      `,
        charset: "UTF-8",
      };

      // Gửi mail
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email đã gửi thành công tới ${data.email}`, info.messageId);
    } catch (error) {
      // Ghi log lỗi
      console.error("LỖI KHI GỬI EMAIL:", error);
      if (error.response) {
        console.error("Mã lỗi SMTP:", error.responseCode);
        console.error("Phản hồi server:", error.response);
      }
      // Gửi thông báo lỗi tới admin nếu cần
      await transporter.sendMail({
        from: '"HTCoaching Error" <hoangthiengym99@gmail.com>',
        to: "hoangthiengym99@gmail.com",
        subject: "LỖI GỬI EMAIL",
        text: `Lỗi khi gửi email xác nhận: ${error.message}`,
      });
    }
    return null;
  }
);
