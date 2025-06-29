import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  DatePicker,
  Button,
  Input,
  message,
  Tag,
  Image,
} from "antd";
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
import { db } from "../../firebase";
import { useUser } from "../../UserContent/UserContext";

const { Option } = Select;
const SELECTED_CUSTOMER_SESSION_KEY = "selected_customer";

const Checkin = () => {
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

  const muscleOptions = ["Ngực", "Lưng", "Chân", "Vai", "Tay", "Bụng"];

  // Format ngày giờ
  const formatDate = (date) => (date ? date.format("DD/MM/YYYY HH:mm") : "N/A");

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

        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const phone = data.phone;
          const total = Math.max(0, Number(data.totalSessions) || 0);
          const remaining = Math.max(0, Number(data.remainingSessions) || 0);
          const used = Math.max(0, total - remaining);

          if (!customersMap.has(phone)) {
            customersMap.set(phone, {
              key: doc.id,
              ...data,
              totalSessions: total,
              remainingSessions: remaining,
              usedSessions: used,
              orders: [
                {
                  id: doc.id,
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
              id: doc.id,
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
  }, []);

  // Tự động tải lịch sử khi có sẵn dữ liệu khách hàng
  useEffect(() => {
    if (!initialLoad && selectedCustomer) {
      fetchCheckinHistory();
    }
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

      const historyData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
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

  // Cột cho bảng checkin chính
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: () => (
        <Select
          value={selectedCustomer}
          onChange={setSelectedCustomer}
          style={{ width: "100%" }}
          showSearch
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          loading={loading}
          placeholder="Chọn khách hàng"
        >
          {customers.map((customer) => (
            <Option key={customer.key} value={customer.key}>
              {customer.name} - {customer.phone}
              <span style={{ marginLeft: 8 }}>
                <Tag color={customer.planMode === "1-1" ? "blue" : "orange"}>
                  {customer.planMode}
                </Tag>
              </span>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Ngày tập",
      dataIndex: "date",
      render: () => (
        <DatePicker
          value={date}
          onChange={setDate}
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ width: "100%" }}
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
      ),
    },
    {
      title: "Nhóm cơ",
      dataIndex: "muscles",
      render: () => (
        <Select
          mode="multiple"
          value={selectedMuscles}
          onChange={setSelectedMuscles}
          style={{ width: "100%" }}
          placeholder="Chọn nhóm cơ"
          options={muscleOptions.map((muscle) => ({
            label: muscle,
            value: muscle,
          }))}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: () => (
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú buổi tập"
          rows={2}
        />
      ),
    },
    {
      title: "Thao tác",
      render: () => (
        <Button
          type="primary"
          onClick={handleCheckin}
          loading={loading}
          disabled={
            !selectedCustomer ||
            !date ||
            selectedMuscles.length === 0 ||
            remainingSessions <= 0
          }
        >
          Xác nhận Check-in
        </Button>
      ),
    },
  ];

  // Cột cho bảng lịch sử checkin
  const historyColumns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {record.photoURL && (
            <Image
              src={record.photoURL}
              alt="avatar"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              preview={false}
            />
          )}
          <strong>{text}</strong>
        </div>
      ),
      width: 200,
    },
    {
      title: "Ngày tập",
      dataIndex: "date",
      key: "date",
      render: (date) => formatDate(date),
      sorter: (a, b) =>
        (a.date ? a.date.valueOf() : 0) - (b.date ? b.date.valueOf() : 0),
      width: 180,
    },
    {
      title: "Thời gian tập",
      key: "time",
      render: (_, record) => (
        <span>{record.date ? record.date.format("HH:mm") : "N/A"}</span>
      ),
      width: 100,
      align: "center",
    },
    {
      title: "Nhóm cơ",
      dataIndex: "muscles",
      key: "muscles",
      render: (muscles) => (
        <div>
          {muscles &&
            muscles.map((muscle, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                {muscle}
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => text || "Không có ghi chú",
    },
    {
      title: "Buổi còn lại",
      dataIndex: "remainingSessions",
      key: "remainingSessions",
      render: (sessions) => (
        <Tag color={sessions > 5 ? "green" : sessions > 0 ? "orange" : "red"}>
          {sessions}
        </Tag>
      ),
      sorter: (a, b) => a.remainingSessions - b.remainingSessions,
      width: 120,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Quản lý Check-in Khách hàng</h2>

      {customerData && (
        <div
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            border: "1px solid #e8e8e8",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {customerData.photoURL && (
              <Image
                src={customerData.photoURL}
                alt="Avatar"
                width={100}
                height={100}
                style={{
                  borderRadius: "50%",
                  border: "2px solid #1890ff",
                  objectFit: "cover",
                }}
                preview={false}
              />
            )}
            <div>
              <h3 style={{ marginBottom: 8 }}>{customerData.name}</h3>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p>
                    <strong>SĐT:</strong> {customerData.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {customerData.email}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Gói tập:</strong>{" "}
                    <Tag color="blue">{customerData.packageTitle}</Tag>
                  </p>
                  <p>
                    <strong>Loại:</strong>{" "}
                    <Tag
                      color={
                        customerData.planMode === "1-1" ? "blue" : "orange"
                      }
                    >
                      {customerData.planMode}
                    </Tag>
                  </p>
                  <p>
                    <strong>Phòng tập:</strong> {customerData.location}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Tổng buổi: </strong> {customerData.totalSessions}
                  </p>
                  <p>
                    <strong>Đã dùng: </strong> {customerData.usedSessions}
                  </p>
                  <p>
                    <strong>Còn lại: </strong>
                    <Tag
                      color={
                        customerData.remainingSessions > 5
                          ? "green"
                          : customerData.remainingSessions > 0
                          ? "orange"
                          : "red"
                      }
                    >
                      {customerData.remainingSessions}
                    </Tag>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {customerData.orders?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Chi tiết các gói tập:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {customerData.orders.map((order, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #e8e8e8",
                      borderRadius: 8,
                      padding: 12,
                      minWidth: 200,
                      backgroundColor:
                        order.remainingSessions > 0 ? "#f6ffed" : "#fff1f0",
                    }}
                  >
                    <p>
                      <strong>Gói {index + 1}:</strong> {order.packageTitle}
                    </p>
                    <p>
                      <strong>Số buổi:</strong> {order.totalSessions}
                    </p>
                    <p>
                      <strong>Còn lại:</strong> {order.remainingSessions}
                    </p>
                    <p>
                      <small>
                        {order.createdAt?.toDate
                          ? dayjs(order.createdAt.toDate()).format("DD/MM/YYYY")
                          : "N/A"}
                      </small>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hiển thị khi không tìm thấy thông tin cho user thường */}
      {!isAdmin && !customerData && !loading && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            border: "1px dashed #e8e8e8",
            borderRadius: 8,
            marginBottom: 24,
            backgroundColor: "#fafafa",
          }}
        >
          <h3>Không tìm thấy thông tin gói tập</h3>
          <p style={{ marginTop: 8 }}>
            Vui lòng liên hệ quản trị viên để được hỗ trợ hoặc kiểm tra lại
            email đăng nhập
          </p>
          <p style={{ marginTop: 4 }}>
            Email đăng nhập: <strong>{user?.email || "Chưa xác định"}</strong>
          </p>
        </div>
      )}

      {/* BẢNG CHỈ HIỆN NẾU LÀ ADMIN */}
      {isAdmin && (
        <Table
          columns={columns}
          dataSource={[{}]}
          pagination={false}
          loading={loading}
          rowKey={() => "checkin-form"}
          bordered
          style={{ marginBottom: 32 }}
        />
      )}

      {/* Lịch sử checkin - luôn hiện */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
          Lịch sử Check-in
        </h3>
        {customerData ? (
          <Table
            columns={historyColumns}
            dataSource={checkinHistory}
            rowKey="id"
            loading={historyLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} buổi tập`,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            locale={{
              emptyText: "Chưa có lịch sử checkin nào",
            }}
            scroll={{ x: 1000 }}
          />
        ) : (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              border: "1px dashed #e8e8e8",
              borderRadius: 8,
              backgroundColor: "#fafafa",
            }}
          >
            <p>Vui lòng chọn khách hàng để xem lịch sử checkin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkin;
