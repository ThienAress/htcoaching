import React from "react";
import "./HeaderMinimal.css";
const HeaderMinimal = () => {
  return (
    <header className="centered-header">
      <div className="logo-container">
        <a href="/">
          <img src="/images/logo.svg" alt="LogoMinimal" className="logo" />
        </a>
      </div>
    </header>
  );
};

export default HeaderMinimal;
