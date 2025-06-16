import { useUser } from "../../UserContent/UserContext";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./User.css";

const User = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  return (
    <div className="user-control">
      {user ? (
        <div className="dropdown-wrapper">
          <div className="user-avatar" onClick={handleToggle}>
            <img src={user.photoURL} alt="avatar" />
            <i className={`fas fa-chevron-down ${isOpen ? "rotate" : ""}`}></i>
          </div>
          {isOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                Hi, <strong>{user.displayName}</strong>
              </div>
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
