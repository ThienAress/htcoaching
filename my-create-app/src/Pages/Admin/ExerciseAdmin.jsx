import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, message, Popconfirm, Divider } from "antd";
import axios from "axios";

const { TextArea } = Input;

const ExerciseAdmin = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();

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
      .map((name) => ({ name }));

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
      message.success("Đã xoá bài tập");
    } catch (err) {
      console.error(err);
      message.error("Xoá thất bại");
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xoá bài tập này?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý bài tập</h2>

      {/* Thêm từng bài tập */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleAddExercise}
        style={{ marginBottom: 24, flexWrap: "wrap" }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Tên bài tập?" }]}
        >
          <Input placeholder="Tên bài tập" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
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
            placeholder={`Nhập mỗi dòng 1 bài tập, ví dụ:\nHít đất\nChạy bộ\nGập bụng`}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm hàng loạt
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={exercises}
        rowKey="_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default ExerciseAdmin;
