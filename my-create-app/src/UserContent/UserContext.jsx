// UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;

        try {
          const adminRef = doc(db, "admin", uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            const data = adminSnap.data();
            console.log("✅ Admin đăng nhập:", data);
            setUser(firebaseUser);
            setUserRole(data.role || "admin");
          } else {
            console.warn("⚠️ Không tìm thấy user trong 'admin' → tạo mới");

            const newAdmin = {
              uid: firebaseUser.uid,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "Người dùng",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              createdAt: new Date(),
              role: "admin",
            };

            await setDoc(adminRef, newAdmin);
            setUser(firebaseUser);
            setUserRole("admin");
          }
        } catch (error) {
          console.error("❌ Lỗi khi lấy hoặc tạo admin từ Firestore:", error);
          setUser(firebaseUser);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
