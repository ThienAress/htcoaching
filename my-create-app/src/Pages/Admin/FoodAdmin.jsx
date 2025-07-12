import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Divider,
} from "antd";
import axios from "axios";

const { TextArea } = Input;
const FOODS_API = "https://htcoaching-backend-1.onrender.com/api/foods";

const FoodAdmin = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get(FOODS_API);
      setFoods(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      message.error("Không thể tải dữ liệu thực phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (values) => {
    try {
      const res = await axios.post(FOODS_API, values);
      setFoods([...foods, res.data.food]);
      message.success("Đã thêm thực phẩm mới");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi thêm thực phẩm");
    }
  };

  const handleBulkAdd = async (values) => {
    const lines = values.bulkData.trim().split("\n");
    const newFoods = [];

    for (const line of lines) {
      const parts = line.split(",");
      if (parts.length >= 2) {
        const [label, value, protein = 0, carb = 0, fat = 0, calories = 0] =
          parts;
        newFoods.push({
          label: label.trim(),
          value: value.trim(),
          protein: parseFloat(protein),
          carb: parseFloat(carb),
          fat: parseFloat(fat),
          calories: parseFloat(calories),
        });
      }
    }

    try {
      const promises = newFoods.map((food) => axios.post(FOODS_API, food));
      const responses = await Promise.all(promises);
      const added = responses.map((res) => res.data.food);
      setFoods([...foods, ...added]);
      message.success(`Đã thêm ${added.length} thực phẩm`);
      bulkForm.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi thêm thực phẩm hàng loạt");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${FOODS_API}/${id}`);
      setFoods(foods.filter((item) => item._id !== id));
      message.success("Đã xoá thực phẩm");
    } catch (err) {
      console.error(err);
      message.error("Xoá thất bại");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const columns = [
    {
      title: "Tên thực phẩm",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Protein",
      dataIndex: "protein",
      key: "protein",
    },
    {
      title: "Carb",
      dataIndex: "carb",
      key: "carb",
    },
    {
      title: "Fat",
      dataIndex: "fat",
      key: "fat",
    },
    {
      title: "Calories",
      dataIndex: "calories",
      key: "calories",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xoá thực phẩm này?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý thực phẩm</h2>

      {/* Thêm từng thực phẩm */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleAddFood}
        style={{ marginBottom: 24, flexWrap: "wrap" }}
      >
        <Form.Item name="label" rules={[{ required: true, message: "Tên?" }]}>
          <Input placeholder="Tên thực phẩm" />
        </Form.Item>
        <Form.Item name="value" rules={[{ required: true, message: "Value?" }]}>
          <Input placeholder="value (không dấu, viết liền)" />
        </Form.Item>
        <Form.Item name="protein">
          <InputNumber placeholder="Protein (g)" min={0} />
        </Form.Item>
        <Form.Item name="carb">
          <InputNumber placeholder="Carb (g)" min={0} />
        </Form.Item>
        <Form.Item name="fat">
          <InputNumber placeholder="Fat (g)" min={0} />
        </Form.Item>
        <Form.Item name="calories">
          <InputNumber placeholder="Calories (kcal)" min={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>

      <Divider>Hoặc thêm nhiều thực phẩm cùng lúc</Divider>

      {/* Thêm nhiều thực phẩm */}
      <Form form={bulkForm} onFinish={handleBulkAdd}>
        <Form.Item name="bulkData">
          <TextArea
            rows={6}
            placeholder={`Nhập mỗi dòng 1 thực phẩm (phân tách bằng dấu phẩy):
Tên,value,protein,carb,fat,calories
Ví dụ:
Ức gà,ucga,30,0,3,165
Cơm trắng,comtrang,3,40,1,180`}
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
        dataSource={foods}
        rowKey="_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default FoodAdmin;
