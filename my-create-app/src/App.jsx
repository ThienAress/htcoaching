import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminLayout from "./Pages/Admin/AdminLayout";
import OrdersPage from "./Pages/Admin/OrdersPage";
import UsersPage from "./Pages/Admin/UsersPage";
import ContactsPage from "./Pages/Admin/ContactsPage";
import ProtectedAdminRoute from "./Pages/Admin/ProtectedAdminRoute";
import PromotionPopup from "./Pages/PromotionPopup/PromotionPopup";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import MealPlane from "./Pages/MealPlan/MealPlan";

function App() {
  return (
    <Routes>
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
            <PromotionPopup />
          </>
        }
      />
      {/* Trang login */}
      <Route path="/login" element={<Login />} />

      {/* Trang signup */}
      <Route path="/signup" element={<SingUp />} />

      {/* Trang Forgot Password */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Trang register */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Trang payment */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* Trang calculator */}
      <Route path="/tdee-calculator" element={<TdeeCalculator />} />

      {/* Trang mealplan */}
      <Route path="/mealplan" element={<MealPlane />} />

      {/* Trang club */}
      <Route path="/club" element={<Club />} />

      {/* Login Admin */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Trang admin có bảo vệ quyền */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="orders" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
