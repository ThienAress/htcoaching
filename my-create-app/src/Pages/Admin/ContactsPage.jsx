import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import dayjs from "dayjs";

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lien_he"), (snapshot) => {
      const contactList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setContacts(contactList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Mạng xã hội",
      dataIndex: "social",
      key: "social",
    },
    {
      title: "Gói quan tâm",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Thời gian",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (timestamp) =>
        timestamp?.toDate
          ? dayjs(timestamp.toDate()).format("DD/MM/YYYY HH:mm:ss")
          : "Chưa có",
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 20 }}>Quản lý liên hệ</h2>
      <Table
        columns={columns}
        dataSource={contacts}
        rowKey="id"
        loading={loading}
        bordered
      />
    </div>
  );
}

export default ContactsPage;
