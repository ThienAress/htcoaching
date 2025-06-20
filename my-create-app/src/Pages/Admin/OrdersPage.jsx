import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { db } from "../../firebase";
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
import dayjs from "dayjs";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { status: "approved" });
      message.success("Đã duyệt đơn hàng thành công");
    } catch (error) {
      console.error("Lỗi duyệt đơn hàng:", error);
      message.error("Lỗi khi duyệt đơn hàng");
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gói tập",
      dataIndex: "packageTitle",
      key: "packageTitle",
    },
    {
      title: "Phòng tập",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Thời gian tập",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule) => (
        <ul style={{ paddingLeft: 20 }}>
          {Array.isArray(schedule) &&
            schedule.map((item, idx) => (
              <li key={idx}>
                {item.day} - {item.time}
              </li>
            ))}
        </ul>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "approved" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.status !== "approved" ? (
          <Button type="primary" onClick={() => handleApprove(record.id)}>
            Xác nhận
          </Button>
        ) : (
          <Tag color="blue">Đã xác nhận</Tag>
        ),
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) =>
        timestamp?.toDate
          ? dayjs(timestamp.toDate()).format("DD/MM/YYYY HH:mm:ss")
          : "Chưa có",
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 20 }}>Quản lý đơn hàng</h2>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default OrdersPage;
