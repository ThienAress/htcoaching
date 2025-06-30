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
const muscleOptions = ["Ngực", "Lưng", "Chân", "Vai", "Tay", "Bụng"];

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
        const q = query(
          collection(db, "orders"),
          where("status", "==", "approved")
        );
        const querySnapshot = await getDocs(q);

        const customersMap = new Map();

        querySnapshot.docs.forEach((docu) => {
          const data = docu.data();
          const phone = data.phone;
          const total = Math.max(0, Number(data.totalSessions) || 0);
          const remaining = Math.max(0, Number(data.remainingSessions) || 0);
          const used = Math.max(0, total - remaining);

          if (!customersMap.has(phone)) {
            customersMap.set(phone, {
              key: docu.id,
              ...data,
              totalSessions: total,
              remainingSessions: remaining,
              usedSessions: used,
              orders: [
                {
                  id: docu.id,
                  totalSessions: total,
                  remainingSessions: remaining,
                  packageTitle: data.packageTitle,
                  planMode: data.planMode,
                  createdAt: data.createdAt,
                },
              ],
            });
          } else {
            const existingCustomer = customersMap.get(phone);
            existingCustomer.totalSessions += total;
            existingCustomer.remainingSessions += remaining;
            existingCustomer.usedSessions = Math.max(
              0,
              existingCustomer.totalSessions -
                existingCustomer.remainingSessions
            );
            existingCustomer.orders.push({
              id: docu.id,
              totalSessions: total,
              remainingSessions: remaining,
              packageTitle: data.packageTitle,
              planMode: data.planMode,
              createdAt: data.createdAt,
            });
          }
        });

        const customersList = Array.from(customersMap.values());
        setCustomers(customersList);

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
  }, []);

  // Tự động tải lịch sử khi có sẵn dữ liệu khách hàng
  useEffect(() => {
    if (!initialLoad && selectedCustomer) {
      fetchCheckinHistory();
    }
    // eslint-disable-next-line
  }, [selectedCustomer, initialLoad]);

  // Fetch lịch sử checkin khi chọn khách hàng
  const fetchCheckinHistory = async () => {
    if (!selectedCustomer) return;

    try {
      setHistoryLoading(true);
      const q = query(
        collection(db, "checkins"),
        where("customerId", "==", selectedCustomer),
        orderBy("date", "desc")
      );
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

      // Sắp xếp đơn hàng theo thứ tự cũ nhất đến mới nhất
      const sortedOrders = [...customer.orders].sort(
        (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      );

      // Tìm đơn hàng có buổi còn lại để trừ
      const orderToUpdate = sortedOrders.find(
        (order) => order.remainingSessions > 0
      );

      if (!orderToUpdate) {
        message.error("Không tìm thấy đơn hàng hợp lệ để trừ buổi");
        return;
      }

      // Cập nhật số buổi còn lại của đơn hàng cụ thể
      const newOrderRemaining = orderToUpdate.remainingSessions - 1;
      await updateDoc(doc(db, "orders", orderToUpdate.id), {
        remainingSessions: newOrderRemaining,
        lastCheckin: dayjs(date).toDate(),
        updatedAt: dayjs().toDate(),
      });

      // Cập nhật local state cho đơn hàng cụ thể
      orderToUpdate.remainingSessions = newOrderRemaining;

      // Tính toán lại tổng số buổi còn lại của tất cả đơn hàng
      const newTotalRemaining = sortedOrders.reduce(
        (sum, order) => sum + order.remainingSessions,
        0
      );

      // Tính toán lại số buổi đã dùng
      const newUsedSessions = customer.totalSessions - newTotalRemaining;

      // Tạo bản ghi checkin
      await addDoc(collection(db, "checkins"), {
        customerId: selectedCustomer,
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
      });

      setRemainingSessions(newTotalRemaining);

      setCustomers((prev) =>
        prev.map((c) =>
          c.key === selectedCustomer
            ? {
                ...c,
                remainingSessions: newTotalRemaining,
                usedSessions: newUsedSessions,
                orders: sortedOrders,
              }
            : c
        )
      );

      setCustomerData({
        ...customerData,
        remainingSessions: newTotalRemaining,
        usedSessions: newUsedSessions,
        orders: sortedOrders,
      });

      // Thêm checkin mới vào cuối danh sách
      const newCheckin = {
        id: `temp_${Date.now()}`,
        customerName: customerData.name,
        date: dayjs(date),
        muscles: selectedMuscles,
        note,
        remainingSessions: newTotalRemaining,
        photoURL: customerData.photoURL || "",
      };
      setCheckinHistory((prev) => [...prev, newCheckin]);

      message.success(`Check-in thành công cho ${customerData.name}`);
      setSelectedMuscles([]);
      setNote("");

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
  };
};

export default useCheckinLogic;
