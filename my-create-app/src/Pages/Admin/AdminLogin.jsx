import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, Card } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const { Title } = Typography;

const AdminLogin = ({ onLoginSuccess }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user.email === "admin@gmail.com") {
        onLoginSuccess();
      } else {
        setError("Tài khoản không có quyền truy cập admin.");
      }
    } catch {
      setError("Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          borderRadius: 8,
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng nhập Admin
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="admin" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
