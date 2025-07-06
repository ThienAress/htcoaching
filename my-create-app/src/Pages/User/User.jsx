import { useState, useEffect } from "react";
import { useUser } from "../../UserContent/UserContext";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import "./User.css";

const User = () => {
  const { user } = useUser();
  const navigate = useNavigate(); // Khởi tạo navigate để chuyển hướng
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState("/default-avatar.png");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;

      try {
        const isGoogle = user.providerData[0]?.providerId === "google.com";
        const isPassword = user.providerData[0]?.providerId === "password";

        if (isPassword) {
          const userDoc = await getDoc(doc(db, "usersSignin", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setDisplayName(data.username || "Người dùng");
            setPhotoURL(data.photoURL || "/default-avatar.png");
          }
        } else if (isGoogle) {
          setDisplayName(user.displayName || "Người dùng");
          setPhotoURL(user.photoURL || "/default-avatar.png");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);

      await updateProfile(user, { photoURL: url });

      if (user.providerData[0]?.providerId === "password") {
        await updateDoc(doc(db, "usersSignin", user.uid), { photoURL: url });
      }

      setPhotoURL(url);
      setIsOpen(false);
    } catch (err) {
      console.error("Lỗi upload avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  // Chuyển hướng đến trang check-in
  const handleCheckinRedirect = () => {
    navigate("/checkin"); // Điều hướng đến trang check-in
  };

  const handleExercisesRedirect = () => {
    navigate("/exercises");
  };

  return (
    <div className="user-control">
      {user ? (
        <div className="dropdown-wrapper">
          <div className="user-avatar" onClick={handleToggle}>
            <img
              src={photoURL || "/default-avatar.png"}
              alt="avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <i className={`fas fa-chevron-down ${isOpen ? "rotate" : ""}`}></i>
          </div>
          {isOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                Hi, <strong>{displayName}</strong>
              </div>
              <label className="upload-btn">
                {uploading ? "Đang tải..." : "Đổi ảnh đại diện"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
              {/* ⭐️ Nút Hệ thống bài tập */}
              <button
                type="button"
                className="btn-checkin"
                onClick={handleExercisesRedirect}
              >
                Hệ thống bài tập
              </button>

              {/* Nút Check-in buổi tập */}
              <button
                type="primary"
                className="btn-checkin"
                onClick={handleCheckinRedirect} // Chuyển hướng khi nhấn nút
              >
                Check-in buổi tập
              </button>

              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/login")}
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
};

export default User;
