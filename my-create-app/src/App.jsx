import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Trainer from "./components/Trainer/Trainer";
import Feedback from "./components/FeedBackSection/Feedback";
import Classes from "./components/ClassSection/Classes";
import Tools from "./components/Tools/Tools";
import Pricing from "./components/PricingSection/Pricing";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ChatIcons from "./components/ChatIcons/ChatIcons";
import Login from "./Pages/Login/Login";
import SingUp from "./Pages/SignUp/SignUp";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import PaymentPage from "./Pages/PaymentPage/PaymentPage";
import TdeeCalculator from "./Pages/TdeeCalculator/TdeeCalculator";
import Club from "./Pages/Club/Club";
import AdminLayout from "./Pages/Admin/AdminLayout";
import OrdersPage from "./Pages/Admin/OrdersPage";
import UsersPage from "./Pages/Admin/UsersPage";
import ContactsPage from "./Pages/Admin/ContactsPage";

function App() {
  return (
    <Routes>
      {/* Route cho trang chủ */}
      <Route
        path="/"
        element={
          <>
            <Header />
            <Hero />
            <About />
            <Trainer />
            <Feedback />
            <Classes />
            <Tools />
            <Pricing />
            <Contact />
            <Footer />
            <ChatIcons />
            <ScrollToTop />
          </>
        }
      />

      {/* Trang đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Trang đăng kí */}
      <Route path="/signup" element={<SingUp />} />

      {/* Trang nhập thông tin thanh toán */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Trang thanh toán */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* Trang tính tdee */}
      <Route path="/tdee-calculator" element={<TdeeCalculator />} />

      {/* Trang CLB */}
      <Route path="/club" element={<Club />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="orders" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
