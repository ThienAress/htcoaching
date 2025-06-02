import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Trainer from "./components/Trainer/Trainer";
import Feedback from "./components/FeedBackSection/Feedback";
import Classes from "./components/ClassSection/Classes";
import Pricing from "./components/PricingSection/Pricing";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ChatIcons from "./components/ChatIcons/ChatIcons";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
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
              <Pricing />
              <Contact />
              <Footer />
              <ScrollToTop />
              <ChatIcons />
            </>
          }
        />

        {/* Trang đăng ký */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
