import React, { useState, useEffect } from "react";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import Contact from "../../components/Contact/Contact";
import ChatIcon from "../../components/ChatIcons/ChatIcons";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import "./Club.css";

const clubs = [
  {
    name: "WAYSTATION TRƯƠNG VĂN HẢI",
    address: "52 Thành Thái, Phường 12, Quận 1, Hồ Chí Minh",
    phone: "1900633638",
    image: "/images/class1.jpg",
  },
  {
    name: "WAYSTATION DÂN CHỦ",
    address: "119 Phổ Quang, Phường 09, Quận 2, Hồ Chí Minh",
    phone: "1900633638",
    image: "/images/class2.jpg",
  },
  {
    name: "WAYSTATION HIỆP BÌNH",
    address: "34-35 Bến Vân Đồn, Phường 12, Quận 3, Hồ Chí Minh",
    phone: "1900633638",
    image: "/images/class3.jpg",
  },
  {
    name: "WAYSTATION QL13",
    address: "34-35 Bến Vân Đồn, Phường 12, Quận 4, Hồ Chí Minh",
    phone: "1900633638",
    image: "/images/class3.jpg",
  },
];

const extractDistricts = (clubs) => {
  const regex = /Quận\s*\d+|Thủ Đức|Phú Nhuận|Tân Bình|Gò Vấp|Bình Thạnh/i;
  const found = clubs
    .map((club) => {
      const match = club.address.match(regex);
      return match ? match[0] : null;
    })
    .filter(Boolean);

  return ["Tất cả", ...Array.from(new Set(found))];
};

const Club = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [districts, setDistricts] = useState(["Tất cả"]);

  useEffect(() => {
    const result = extractDistricts(clubs);
    setDistricts(result);
  }, []);

  const filteredClubs =
    selectedDistrict === "Tất cả"
      ? clubs
      : clubs.filter((club) => club.address.includes(selectedDistrict));

  return (
    <>
      <HeaderMinimal />
      <section className="club">
        <div className="container">
          <h2 className="club-title title">CÂU LẠC BỘ HIỆN MÌNH ĐANG DẠY</h2>
          <p className="desc club-desc">
            Hiện tại mình đang dạy ở TP Thủ Đức gồm (Quận 9, Quận 2, Thủ Đức)
          </p>

          <div className="club-filter">
            <label htmlFor="district-filter">Lọc theo quận: </label>
            <select
              id="district-filter"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="club-grid">
            {filteredClubs.map((club, index) => (
              <div className="club-card" key={index}>
                <img src={club.image} alt={club.name} className="club-image" />
                <div className="club-content">
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-address">
                    <i className="fas fa-map-marker-alt"></i> {club.address}
                  </p>
                  <p className="club-phone">
                    <i className="fas fa-phone-alt"></i> {club.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Contact />
      <ChatIcon />
      <ScrollToTop />
      <FooterMinimal />
    </>
  );
};

export default Club;
