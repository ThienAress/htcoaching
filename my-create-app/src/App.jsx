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
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import PaymentPage from "./Pages/PaymentPage/PaymentPage";
import TdeeCalculator from "./Pages/TdeeCalculator/TdeeCalculator";

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
            <ScrollToTop />
            <ChatIcons />
          </>
        }
      />

      {/* Trang đăng kí */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Trang thanh toán */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* Trang tính tdee */}
      <Route path="/tdee-calculator" element={<TdeeCalculator />} />
    </Routes>
  );
}

export default App;
