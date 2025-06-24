import React, { useState } from "react";
import { Table, Input, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../../firebase";

const db = getFirestore(app);

const FoodNutritionTable = ({ foodDatabase }) => {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [commonSuggestion, setCommonSuggestion] = useState("");

  const handleSendSuggestion = async () => {
    if (!commonSuggestion.trim()) {
      alert("⚠️ Vui lòng nhập góp ý trước khi gửi");
      return;
    }

    try {
      await addDoc(collection(db, "foodSuggestions"), {
        suggestion: commonSuggestion.trim(),
        createdAt: serverTimestamp(),
      });

      setCommonSuggestion("");
      alert("✅ Cảm ơn bạn đã góp ý!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi gửi góp ý, vui lòng thử lại");
    }
  };

  const filteredData = foodDatabase
    .filter((item) =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const calA = a.protein * 4 + a.carb * 4 + a.fat * 9;
      const calB = b.protein * 4 + b.carb * 4 + b.fat * 9;
      if (sortOrder === "ascend") return calA - calB;
      if (sortOrder === "descend") return calB - calA;
      return 0;
    });

  const columns = [
    {
      title: (
        <div>
          Thực phẩm
          <div style={{ marginTop: 4 }}>
            <Select
              value={sortOrder || undefined}
              onChange={(value) => setSortOrder(value || null)}
              placeholder="Sắp xếp calories"
              style={{ width: "100%" }}
              options={[
                { value: "ascend", label: "Calories tăng dần" },
                { value: "descend", label: "Calories giảm dần" },
              ]}
              allowClear
            />
          </div>
        </div>
      ),
      dataIndex: "label",
      key: "label",
      width: 200,
      fixed: "left",
    },
    {
      title: "Gram (mặc định)",
      key: "gram",
      render: () => "100g",
    },
    {
      title: "Protein (g)",
      dataIndex: "protein",
      key: "protein",
      render: (text) => parseFloat(text).toFixed(1),
    },
    {
      title: "Carb (g)",
      dataIndex: "carb",
      key: "carb",
      render: (text) => parseFloat(text).toFixed(1),
    },
    {
      title: "Fat (g)",
      dataIndex: "fat",
      key: "fat",
      render: (text) => parseFloat(text).toFixed(1),
    },
    {
      title: "Calories",
      key: "calories",
      render: (_, record) =>
        Math.round(record.protein * 4 + record.carb * 4 + record.fat * 9),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Input
          placeholder="Tìm kiếm thực phẩm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, minWidth: 150 }}
        />
        <Button type="primary" icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record._id}
        scroll={{ x: 700 }}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Input.TextArea
          placeholder="Bạn muốn mình thêm thực phẩm nào thì góp ý nha..."
          value={commonSuggestion}
          onChange={(e) => setCommonSuggestion(e.target.value)}
          rows={2}
          style={{ flex: 1, minWidth: 200, resize: "none" }}
        />
        <Button type="primary" onClick={handleSendSuggestion}>
          Gửi góp ý
        </Button>
      </div>
    </div>
  );
};

export default FoodNutritionTable;
