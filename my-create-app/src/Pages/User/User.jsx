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

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (user?.providerData[0]?.providerId === "password") {
        const docRef = doc(db, "usersSignin", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDisplayName(docSnap.data().username);
        }
      } else {
        setDisplayName(user.displayName);
      }
    };
    if (user) fetchDisplayName();
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
      const photoURL = await getDownloadURL(avatarRef);

      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, "usersSignin", user.uid), { photoURL });

      window.location.reload(); // Refresh để cập nhật ảnh
    } catch (err) {
      console.error("Lỗi khi upload avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="user-control">
      {user ? (
        <div className="dropdown-wrapper">
          <div className="user-avatar" onClick={handleToggle}>
            <img src={user.photoURL || "/default-avatar.png"} alt="avatar" />
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
