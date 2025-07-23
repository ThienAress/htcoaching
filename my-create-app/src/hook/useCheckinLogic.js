import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../UserContent/UserContext";
import { message } from "antd";

const SELECTED_CUSTOMER_SESSION_KEY = "selected_customer";
const muscleOptions = ["Ngực", "Lưng", "Chân", "Vai", "Tay", "Bụng", "Cardio"];

const useCheckinLogic = () => {
  const { userRole, user } = useUser();
  const isAdmin = userRole === "admin";

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [note, setNote] = useState("");
  const [remainingSessions, setRemainingSessions] = useState(0);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // >>> Thêm state allOrders
  const [allOrders, setAllOrders] = useState([]);

  // Lưu selectedCustomer vào sessionStorage
  useEffect(() => {
    if (selectedCustomer) {
      sessionStorage.setItem(SELECTED_CUSTOMER_SESSION_KEY, selectedCustomer);
    } else {
      sessionStorage.removeItem(SELECTED_CUSTOMER_SESSION_KEY);
    }
  }, [selectedCustomer]);

  // Tự động chọn user đang đăng nhập nếu không phải admin
  useEffect(() => {
    if (!isAdmin && user && customers.length > 0) {
      const currentUser = customers.find((c) => c.email === user.email);
      if (currentUser) {
        setSelectedCustomer(currentUser.key);
      }
    }
  }, [isAdmin, user, customers]);

  // Fetch danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        let q;
        if (isAdmin) {
          q = query(
            collection(db, "orders"),
            where("status", "==", "approved")
          );
        } else {
          if (!user?.uid) return setLoading(false);
          q = query(
            collection(db, "orders"),
            where("status", "==", "approved"),
            where("uid", "==", user.uid)
          );
        }
        const querySnapshot = await getDocs(q);

        // ==== GOM THEO phone + planMode ====
        const customersMap = new Map();

        querySnapshot.docs.forEach((docu) => {
          const data = docu.data();
          const phone = data.phone;
          const planMode = data.planMode || "default";
          const key = `${phone}_${planMode}`;

          const total = Math.max(0, Number(data.totalSessions) || 0);
          const remaining = Math.max(0, Number(data.remainingSessions) || 0);
          const used = total - remaining;

          if (!customersMap.has(key)) {
            customersMap.set(key, {
              key: docu.id + "_" + planMode,
              ...data,
              planMode: planMode,
              totalSessions: total,
              remainingSessions: remaining,
              usedSessions: Math.max(0, used),
              orders: [
                {
                  id: docu.id,
                  totalSessions: total,
                  remainingSessions: remaining,
                  packageTitle: data.packageTitle,
                  planMode: data.planMode,
                  createdAt: data.createdAt,
                  uid: data.uid || "",
                },
              ],
            });
          } else {
            const existingCustomer = customersMap.get(key);
            existingCustomer.totalSessions += total;
            existingCustomer.remainingSessions += remaining;
            existingCustomer.usedSessions += used;
            existingCustomer.orders.push({
              id: docu.id,
              totalSessions: total,
              remainingSessions: remaining,
              packageTitle: data.packageTitle,
              planMode: data.planMode,
              createdAt: data.createdAt,
              uid: data.uid || "",
            });
          }
        });

        const customersList = Array.from(customersMap.values());
        setCustomers(customersList);

        // >>> Tạo mảng allOrders: mỗi đơn là 1 phần tử (dù cùng KH, cùng hay khác planMode)
        const flatOrders = [];
        customersList.forEach((customer) => {
          (customer.orders || []).forEach((order) => {
            flatOrders.push({
              ...customer,
              ...order,
              orders: undefined, // tránh loop khi truyền vào component
            });
          });
        });
        setAllOrders(flatOrders);

        // Khôi phục selectedCustomer từ sessionStorage
        const savedCustomer = sessionStorage.getItem(
          SELECTED_CUSTOMER_SESSION_KEY
        );
        if (
          savedCustomer &&
          customersList.some((c) => c.key === savedCustomer)
        ) {
          setSelectedCustomer(savedCustomer);
        }

        setInitialLoad(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("Lỗi khi tải danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
    // eslint-disable-next-line
  }, [user, isAdmin]);

  // ... Các useEffect và logic khác giữ nguyên

  // Tự động tải lịch sử khi có sẵn dữ liệu khách hàng
  useEffect(() => {
    if (!initialLoad && (isAdmin ? selectedCustomer : user?.uid)) {
      fetchCheckinHistory();
    }
    // eslint-disable-next-line
  }, [selectedCustomer, initialLoad, user, isAdmin]);

  // Fetch lịch sử checkin
  const fetchCheckinHistory = async () => {
    try {
      setHistoryLoading(true);
      let q;
      let targetUid = "";

      if (isAdmin && selectedCustomer) {
        // Admin xem lịch sử của khách được chọn
        const thisCustomer = customers.find((c) => c.key === selectedCustomer);
        if (!thisCustomer?.uid) {
          setCheckinHistory([]);
          setHistoryLoading(false);
          return;
        }
        targetUid = thisCustomer.uid;
        q = query(
          collection(db, "checkins"),
          where("customerId", "==", targetUid),
          orderBy("date", "desc")
        );
      } else if (user?.uid) {
        // User chỉ xem lịch sử của chính mình
        targetUid = user.uid;
        q = query(
          collection(db, "checkins"),
          where("customerId", "==", targetUid),
          orderBy("date", "desc")
        );
      } else {
        setCheckinHistory([]);
        setHistoryLoading(false);
        return;
      }

      const snapshot = await getDocs(q);

      const historyData = snapshot.docs.map((docu) => {
        const data = docu.data();
        return {
          id: docu.id,
          date: data.date?.toDate ? dayjs(data.date.toDate()) : null,
          muscles: data.muscles || [],
          note: data.note || "",
          remainingSessions: data.remainingSessions || 0,
          customerName: data.customerName || "Không xác định",
          photoURL: data.photoURL || "",
        };
      });

      setCheckinHistory(historyData);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử checkin:", error);
      message.error("Lỗi khi tải lịch sử checkin");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Xử lý khi chọn khách hàng
  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find((c) => c.key === selectedCustomer);
      if (customer) {
        setCustomerData(customer);
        setRemainingSessions(customer.remainingSessions);
      } else {
        sessionStorage.removeItem(SELECTED_CUSTOMER_SESSION_KEY);
        setCustomerData(null);
        setCheckinHistory([]);
        setRemainingSessions(0);
      }
    } else {
      setCustomerData(null);
      setCheckinHistory([]);
      setRemainingSessions(0);
    }
  }, [selectedCustomer, customers]);
  // Xử lý checkin
  const handleCheckin = async () => {
    if (!selectedCustomer || !date || selectedMuscles.length === 0) {
      message.warning("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    if (!customerData) {
      message.error("Không tìm thấy thông tin khách hàng");
      return;
    }

    if (remainingSessions <= 0) {
      message.error("Khách hàng đã hết số buổi tập");
      return;
    }

    try {
      setLoading(true);
      const customer = customers.find((c) => c.key === selectedCustomer);

      // Sắp xếp đơn hàng theo thứ tự cũ nhất đến mới nhất (FIFO)
      const sortedOrders = [...customer.orders].sort(
        (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      );

      // Tìm đơn hàng có buổi còn lại để trừ (theo thứ tự cũ nhất)
      let orderToUpdate = null;
      for (let i = 0; i < sortedOrders.length; i++) {
        if (sortedOrders[i].remainingSessions > 0) {
          orderToUpdate = sortedOrders[i];
          break;
        }
      }

      // Nếu không tìm thấy, thử tìm một đơn hàng bất kỳ có totalSessions > 0
      if (!orderToUpdate) {
        orderToUpdate = sortedOrders.find((order) => order.totalSessions > 0);
      }

      if (!orderToUpdate) {
        message.error("Không tìm thấy đơn hàng hợp lệ để trừ buổi");
        return;
      }

      // Tính toán lại số buổi còn lại
      const newOrderRemaining = Math.max(
        0,
        orderToUpdate.remainingSessions - 1
      );
      const newTotalRemaining = customer.remainingSessions - 1;
      const newUsedSessions = customer.usedSessions + 1;

      // Cập nhật Firestore
      await updateDoc(doc(db, "orders", orderToUpdate.id), {
        remainingSessions: newOrderRemaining,
        lastCheckin: dayjs(date).toDate(),
        updatedAt: dayjs().toDate(),
      });

      // Lấy UID của khách hàng
      let targetUid = "";
      if (isAdmin) {
        targetUid = orderToUpdate.uid || customerData.uid || "";
      } else {
        targetUid = user?.uid || "";
      }

      if (!targetUid) {
        message.error(
          "Không xác định được UID khách hàng, vui lòng kiểm tra lại!"
        );
        setLoading(false);
        return;
      }

      // Tạo bản ghi checkin
      await addDoc(collection(db, "checkins"), {
        customerId: targetUid,
        customerName: customerData.name,
        date: dayjs(date).toDate(),
        muscles: selectedMuscles,
        note,
        remainingSessions: newTotalRemaining,
        totalSessions: customerData.totalSessions,
        package: customerData.packageTitle,
        planMode: customerData.planMode,
        photoURL: customerData.photoURL || "",
        createdAt: dayjs().toDate(),
        email: customerData.email,
        uid: targetUid,
      });

      // Cập nhật state
      setRemainingSessions(newTotalRemaining);

      // Cập nhật danh sách khách hàng
      setCustomers((prev) =>
        prev.map((c) =>
          c.key === selectedCustomer
            ? {
                ...c,
                remainingSessions: newTotalRemaining,
                usedSessions: newUsedSessions,
                orders: c.orders.map((order) =>
                  order.id === orderToUpdate.id
                    ? { ...order, remainingSessions: newOrderRemaining }
                    : order
                ),
              }
            : c
        )
      );

      // Cập nhật customerData hiện tại
      setCustomerData((prev) => ({
        ...prev,
        remainingSessions: newTotalRemaining,
        usedSessions: newUsedSessions,
        orders: prev.orders.map((order) =>
          order.id === orderToUpdate.id
            ? { ...order, remainingSessions: newOrderRemaining }
            : order
        ),
      }));

      // Thêm checkin mới vào lịch sử
      const newCheckin = {
        id: `temp_${Date.now()}`,
        customerName: customerData.name,
        date: dayjs(date),
        muscles: selectedMuscles,
        note,
        remainingSessions: newTotalRemaining,
        photoURL: customerData.photoURL || "",
      };
      setCheckinHistory((prev) => [newCheckin, ...prev]);

      message.success(`Check-in thành công cho ${customerData.name}`);
      setSelectedMuscles([]);
      setNote("");

      // Tải lại lịch sử sau 1 giây
      setTimeout(fetchCheckinHistory, 1000);
    } catch (error) {
      console.error("Lỗi khi check-in:", error);
      message.error("Đã có lỗi xảy ra khi check-in");
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    customerData,
    setCustomerData,
    date,
    setDate,
    selectedMuscles,
    setSelectedMuscles,
    note,
    setNote,
    remainingSessions,
    loading,
    checkinHistory,
    historyLoading,
    userRole,
    user,
    isAdmin,
    handleCheckin,
    muscleOptions,
    allOrders, // <--- mảng flatten mọi đơn (dùng cho display all packages)
  };
};

export default useCheckinLogic;
