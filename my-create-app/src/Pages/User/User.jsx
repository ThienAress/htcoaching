import { useState, useEffect } from "react";
import { useUser } from "../../UserContent/UserContext";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./User.css";

const User = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;

      if (user.providerData[0]?.providerId === "password") {
        const docSnap = await getDoc(doc(db, "usersSignin", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.username);
          setPhotoURL(data.photoURL || user.photoURL || "/default-avatar.png");
        }
      } else {
        setDisplayName(user.displayName || "Người dùng");
        setPhotoURL(user.photoURL || "/default-avatar.png");
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

      // Nếu tài khoản thường → cập nhật Firestore
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

  return (
    <div className="user-control">
      {user ? (
        <div className="dropdown-wrapper">
          <div className="user-avatar" onClick={handleToggle}>
            <img src={photoURL} alt="avatar" />
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
