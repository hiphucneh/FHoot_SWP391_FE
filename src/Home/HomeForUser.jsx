import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeForUser.css";
import Banner1 from '../assets/home/banner1.png';
import Banner2 from '../assets/home/banner2.png';
import Banner3 from '../assets/home/banner3.png';
import AdvHost from "../Host/AdvHost.jsx";

function HomeForUser({ setShowLogin, setRedirectAfterLogin }) {
  const navigate = useNavigate();
  const [showAdvHost, setShowAdvHost] = useState(false);

  const handleLearnMore = () => {
    navigate("/information");
  };

  const handlePlayNow = () => {
    navigate("/enter-pin"); 
  };

  const handleBecomeHost = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRedirectAfterLogin("/payhost"); // set path để login xong chuyển tiếp
      setShowLogin(true);
    } else {
      navigate("/payhost");
    }
  };

  return (
    <div className="home-for-user">
      <h2 className="home-for-user__title">✨ Discover Kahoot! Features</h2>

      <div className="home-for-user__banners">
        <div className="banner-card">
          <img src={Banner1} alt="About Kahoot" />
          <div className="banner-content">
            <h3>What is Kahoot?</h3>
            <p>Explore the basics of how Kahoot works in a fun and simple way for kids of all ages!</p>
            <button onClick={handleLearnMore}>Learn More</button>
          </div>
        </div>

        <div className="banner-card">
          <img src={Banner2} alt="Live Games" />
          <div className="banner-content">
            <h3>Play Live Kahoots</h3>
            <p>Join exciting games in real-time and compete with friends or classmates!</p>
            <button onClick={handlePlayNow}>Play Now</button>
          </div>
        </div>

        <div className="banner-card">
          <img src={Banner3} alt="Create Quizzes" />
          <div className="banner-content">
            <h3>Create Your Own Quiz</h3>
            <p>Design interactive quizzes and share them as a host with your class or audience.</p>
            <button onClick={() => setShowAdvHost(true)}>Become a Host Now</button>
          </div>
        </div>
      </div>

      {/* Popup Become Host */}
      <AdvHost 
        show={showAdvHost} 
        onClose={() => setShowAdvHost(false)} 
        onBecomeHost={handleBecomeHost}
      />
    </div>
  );
}

export default HomeForUser;
