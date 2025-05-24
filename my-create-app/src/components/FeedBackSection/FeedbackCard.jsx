import "./Feedback.css";

function FeedbackCard({
  beforeImg,
  afterImg,
  name,
  age,
  job,
  result,
  duration,
  message,
}) {
  return (
    <div className="swiper-slide">
      <div className="feedback-card">
        <div className="image-section">
          <div className="image-box">
            <img src={beforeImg} alt="Before" />
            <span className="label">Before</span>
          </div>
          <div className="image-box">
            <img src={afterImg} alt="After" />
            <span className="label">After</span>
          </div>
        </div>
        <div className="feedback-body">
          <h4>
            {name}, {age} tuổi
          </h4>
          <p>{message}</p>
          <div className="info-wrapper">
            <div className="info-left">{job}</div>
            <div className="info-right">
              <span>
                Kết quả: <strong>{result}</strong>
              </span>
              <span>
                Thời gian: <strong>{duration}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackCard;
