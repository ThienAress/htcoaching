import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, message, Popconfirm, Divider } from "antd";
import axios from "axios";

const { TextArea } = Input;

const ExerciseAdmin = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();

  // Batch edit state
  const [isBatchEditing, setIsBatchEditing] = useState(false);
  const [editableData, setEditableData] = useState([]);

  // Lấy danh sách bài tập
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/exercises");
      setExercises(res.data);
    } catch (err) {
      console.error("Lỗi lấy bài tập:", err);
      message.error("Không thể tải bài tập");
    } finally {
      setLoading(false);
    }
  };

  // Thêm 1 bài tập
  const handleAddExercise = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/exercises",
        values
      );
      setExercises([...exercises, res.data.exercise]);
      message.success("Đã thêm bài tập mới");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi thêm bài tập");
    }
  };

  // Thêm nhiều bài tập cùng lúc
  const handleBulkAdd = async (values) => {
    const lines = values.bulkData.trim().split("\n");
    const newExercises = lines
      .map((line) => line.trim())
      .filter((line) => !!line)
      .map((row) => {
        // Tách theo dấu |
        const [name, muscleGroup, description] = row
          .split("|")
          .map((s) => (s ? s.trim() : ""));
        return { name, muscleGroup, description };
      })
      .filter((ex) => ex.name && ex.muscleGroup); // Phải có đủ tên và nhóm cơ

    if (newExercises.length === 0) {
      message.warning("Dữ liệu chưa hợp lệ. Mỗi dòng cần có Tên và Nhóm cơ.");
      return;
    }

    try {
      const promises = newExercises.map((ex) =>
        axios.post("http://localhost:5000/api/exercises", ex)
      );
      const responses = await Promise.all(promises);
      const added = responses.map((res) => res.data.exercise);
      setExercises([...exercises, ...added]);
      message.success(`Đã thêm ${added.length} bài tập`);
      bulkForm.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi thêm bài tập hàng loạt");
    }
  };

  // Xoá bài tập
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/exercises/${id}`);
      setExercises(exercises.filter((item) => item._id !== id));
      if (isBatchEditing) {
        setEditableData(editableData.filter((item) => item._id !== id));
      }
      message.success("Đã xoá bài tập");
    } catch (err) {
      console.error(err);
      message.error("Xoá thất bại");
    }
  };

  // Batch edit logic
  const handleBatchEdit = () => {
    setEditableData(JSON.parse(JSON.stringify(exercises))); // Deep copy
    setIsBatchEditing(true);
  };

  const handleFieldChange = (value, recordId, field) => {
    setEditableData((prev) =>
      prev.map((row) =>
        row._id === recordId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleBatchSave = async () => {
    try {
      setLoading(true);
      const promises = editableData.map((row) =>
        axios.put(`http://localhost:5000/api/exercises/${row._id}`, row)
      );
      await Promise.all(promises);
      setExercises(editableData); // update UI luôn
      setIsBatchEditing(false);
      message.success("Đã lưu toàn bộ thay đổi!");
    } catch {
      message.error("Có lỗi khi lưu hàng loạt.");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchCancel = () => {
    setIsBatchEditing(false);
    setEditableData([]);
  };

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        isBatchEditing ? (
          <Input
            value={
              editableData.find((row) => row._id === record._id)?.name || ""
            }
            onChange={(e) =>
              handleFieldChange(e.target.value, record._id, "name")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Nhóm cơ",
      dataIndex: "muscleGroup",
      key: "muscleGroup",
      render: (text, record) =>
        isBatchEditing ? (
          <Input
            value={
              editableData.find((row) => row._id === record._id)?.muscleGroup ||
              ""
            }
            onChange={(e) =>
              handleFieldChange(e.target.value, record._id, "muscleGroup")
            }
          />
        ) : (
          text || <span style={{ color: "#bbb" }}>Chưa có</span>
        ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text, record) =>
        isBatchEditing ? (
          <Input
            value={
              editableData.find((row) => row._id === record._id)?.description ||
              ""
            }
            onChange={(e) =>
              handleFieldChange(e.target.value, record._id, "description")
            }
          />
        ) : (
          text || <span style={{ color: "#bbb" }}>Chưa có</span>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xoá bài tập này?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button danger disabled={isBatchEditing}>
            Xoá
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý bài tập</h2>

      {/* Thêm từng bài tập */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleAddExercise}
        style={{ marginBottom: 24, flexWrap: "wrap", gap: 8 }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Tên bài tập?" }]}
        >
          <Input placeholder="Tên bài tập" />
        </Form.Item>
        <Form.Item
          name="muscleGroup"
          rules={[{ required: true, message: "Nhóm cơ?" }]}
        >
          <Input placeholder="Nhóm cơ (VD: Ngực, Lưng, Chân...)" />
        </Form.Item>
        <Form.Item name="description">
          <Input placeholder="Mô tả chi tiết (tuỳ chọn)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isBatchEditing}>
            Thêm
          </Button>
        </Form.Item>
      </Form>

      <Divider>Hoặc thêm nhiều bài tập cùng lúc</Divider>

      {/* Thêm nhiều bài tập */}
      <Form form={bulkForm} onFinish={handleBulkAdd}>
        <Form.Item name="bulkData">
          <TextArea
            rows={6}
            placeholder={
              `Mỗi dòng 1 bài tập, định dạng:\n` +
              `Tên bài tập | Nhóm cơ | Mô tả (có thể bỏ)\n\n` +
              `Ví dụ:\nBarbell Bench Press | Ngực | Đẩy ngực cơ bản\nDeadlift | Lưng | Kéo tạ từ sàn\n`
            }
            disabled={isBatchEditing}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isBatchEditing}>
            Thêm hàng loạt
          </Button>
        </Form.Item>
      </Form>

      {/* Nút điều khiển Batch Edit */}
      <div style={{ margin: "18px 0" }}>
        {!isBatchEditing ? (
          <Button type="primary" onClick={handleBatchEdit}>
            Chỉnh sửa hàng loạt
          </Button>
        ) : (
          <>
            <Button type="primary" onClick={handleBatchSave}>
              Lưu tất cả
            </Button>
            <Button onClick={handleBatchCancel} style={{ marginLeft: 8 }}>
              Huỷ
            </Button>
          </>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={isBatchEditing ? editableData : exercises}
        rowKey="_id"
        loading={loading}
        bordered
        style={{ marginTop: 20 }}
        pagination={{ pageSize: 12 }}
      />
    </div>
  );
};

export default ExerciseAdmin;
