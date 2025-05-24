import "./ChatIcon.css";
function ChatIcons() {
  return (
    <div className="chat">
      <div className="chat-icons">
        <a
          href="https://zalo.me/0934215227"
          target="_blank"
          rel="noopener noreferrer"
          className="zalo"
        >
          <i className="fas fa-comment-dots"></i>
        </a>
        <a
          href="https://m.me/thienvo123456"
          target="_blank"
          rel="noopener noreferrer"
          className="messenger"
        >
          <i className="fas fa-comment-dots"></i>
        </a>
      </div>
    </div>
  );
}

export default ChatIcons;
