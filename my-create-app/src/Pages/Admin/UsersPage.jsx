import React, { useEffect, useState } from "react";
import { Table, Select } from "antd";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import dayjs from "dayjs";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "usersSignin"),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            providerId:
              data.providerId || (data.username ? "password" : "google.com"),
          };
        });
        setUsers(userList);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((user) =>
          filter === "password"
            ? user.providerId === "password"
            : user.providerId === "google.com"
        );

  const columns = [
    ...(filter !== "google.com"
      ? [
          {
            title: "Tên tài khoản",
            dataIndex: "username",
            key: "username",
          },
        ]
      : []),
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date?.toDate
          ? dayjs(date.toDate()).format("DD/MM/YYYY HH:mm:ss")
          : "Chưa có",
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý người dùng</h2>
      <div style={{ marginBottom: 20 }}>
        <Select
          defaultValue="all"
          value={filter}
          onChange={setFilter}
          style={{ width: 250 }}
        >
          <Select.Option value="all">Tất cả người dùng</Select.Option>
          <Select.Option value="password">Người dùng tài khoản</Select.Option>
          <Select.Option value="google.com">Người dùng Gmail</Select.Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        bordered
      />
    </div>
  );
}

export default UsersPage;
