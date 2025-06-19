import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import AdminLogin from "./AdminLogin";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split("/").pop();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Đăng xuất lỗi:", error.message);
      });
  };

  const menuItems = [
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: <NavLink to="/admin/orders">Đơn hàng</NavLink>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <NavLink to="/admin/users">Người dùng</NavLink>,
    },
    {
      key: "contacts",
      icon: <ContactsOutlined />,
      label: <NavLink to="/admin/contacts">Liên hệ</NavLink>,
    },
    {
      key: "logout",
      icon: <ContactsOutlined />,
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === "admin@gmail.com") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return <div>Đang kiểm tra xác thực...</div>;

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={230} style={{ background: "#001529" }}>
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "16px 0",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          HTCOACHING Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            Bảng điều khiển quản trị
          </Title>
        </Header>

        <Content
          style={{ margin: "24px 16px", padding: 24, background: "#fff" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
