function ClassCard({ image, title, desc, benefits }) {
  return (
    <div className="class-card">
      <div className="class-image">
        <img src={image} alt={title} />
      </div>
      <div className="class-content">
        <h3>{title}</h3>
        <p>{desc}</p>
        <ul className="class-benefits">
          {benefits.map((b, i) => (
            <li key={i}>
              <i className="fas fa-check-circle"></i> {b}
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-outline">
          <i className="fa-solid fa-arrow-right"></i> NHẬN TƯ VẤN MIỄN PHÍ
        </a>
      </div>
    </div>
  );
}

export default ClassCard;
