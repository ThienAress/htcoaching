import { useEffect, useState } from "react";
import "./ScrollToTop.css";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;

      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerPosition = footer.offsetTop;

      if (scrollPosition + viewportHeight >= footerPosition - 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", checkScroll);

    // Gọi lần đầu sau 300ms để chắc chắn footer đã xuất hiện
    const timeout = setTimeout(() => checkScroll(), 300);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      clearTimeout(timeout);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="scrollToTopBtn">
      {isVisible && (
        <button
          className="scrollToTopBtn-button"
          onClick={handleClick}
          title="Lên đầu trang"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </section>
  );
};

export default ScrollToTopButton;
