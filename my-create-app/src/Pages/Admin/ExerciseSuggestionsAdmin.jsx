import React, { useEffect, useState } from "react";
import { Table, Spin, message, Popconfirm, Button } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app } from "../../firebase";

const db = getFirestore(app);

const ExerciseSuggestionsAdmin = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const q = query(
        collection(db, "exerciseSuggestions"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách góp ý bài tập");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "exerciseSuggestions", id));
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      message.success("Xoá góp ý thành công");
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi xoá góp ý");
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Góp ý", dataIndex: "suggestion", key: "suggestion" },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt?.toDate
          ? createdAt.toDate().toLocaleString()
          : "Không xác định",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xoá góp ý này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button danger type="default" size="medium">
            Xoá
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách góp ý bài tập</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={suggestions}
          rowKey="id"
          bordered
        />
      )}
    </div>
  );
};

export default ExerciseSuggestionsAdmin;
