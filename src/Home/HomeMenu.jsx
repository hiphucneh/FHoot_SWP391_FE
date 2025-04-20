import './styles.css';
import 'remixicon/fonts/remixicon.css';

function HomeMenu() {
  return (
    <div className="home-menu-wrapper">
      <div className="home-menu"></div>
    <div className="home-menu">
      {/* Top Section: Join Code + Avatar Box */}
      <div className="home-menu__top">
        <div className="home-menu__join-box">
          <input type="text" placeholder="Enter join code" className="join-input" />
          <button className="join-button">Join</button>
        </div>
        <div className="home-menu__qbit-box">
          <h3>Introducing Qbit</h3>
          <button className="edit-qbit-button">
            <i className="ri-pencil-line"></i> Customize My Qbit
          </button>
          <img
            src="https://static.quizizz.com/img/qbit/qbit-1.png" // placeholder image
            alt="Qbit Character"
            className="qbit-image"
          />
        </div>
      </div>

      {/* Ice Breaker Section */}
      <div className="home-menu__section">
        <div className="section-header">
          <h2><i className="ri-star-fill section-icon"></i> Ice breaker</h2>
          <a href="#" className="see-more">See more</a>
        </div>

        <div className="quiz-card-container">
          {[
            { title: "Around the World", questions: 8, plays: "156k", img: "🌍" },
            { title: "True or False", questions: 12, plays: "263k", img: "📣" },
            { title: "Student Introduction", questions: 14, plays: "33k", img: "🧑‍🎓" },
            { title: "Warm-up Riddles", questions: 4, plays: "53k", img: "😊" },
            { title: "This or That", questions: 12, plays: "60k", img: "❓" }
          ].map((quiz, index) => (
            <div className="quiz-card" key={index}>
              <div className="quiz-img">{quiz.img}</div>
              <div className="quiz-title">{quiz.title}</div>
              <div className="quiz-meta">
                <span>{quiz.questions} Qs</span>
                <span>{quiz.plays} plays</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
        
  );
}

export default HomeMenu;
