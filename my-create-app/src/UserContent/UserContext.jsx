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
      if (!firebaseUser) {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      const uid = firebaseUser.uid;

      try {
        // Kiểm tra admin
        const adminRef = doc(db, "admin", uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setUser(firebaseUser);
          setUserRole("admin");
        } else {
          // Nếu không phải admin → lưu thông tin vào usersSignin nếu chưa có
          const userRef = doc(db, "usersSignin", uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const newUser = {
              uid,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "Người dùng",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              createdAt: new Date(),
              role: "user",
            };
            await setDoc(userRef, newUser);
          }

          setUser(firebaseUser);
          setUserRole("user");
        }
      } catch (error) {
        console.error("❌ Lỗi khi xử lý user:", error);
        setUser(firebaseUser);
        setUserRole(null); // fallback
      } finally {
        setLoading(false);
      }
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
